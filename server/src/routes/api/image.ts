import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import AWS from 'aws-sdk'
import express, { Request, Response } from 'express'

import { UserModel } from '../../interfaces/auth/User'
import { DeleteImageDTO } from '../../interfaces/image/DeleteImageDTO'
import { ImageModel } from '../../interfaces/image/Image'
import { UpdateImageDTO } from '../../interfaces/image/UpdateImageDTO'
import { UploadImageDTO } from '../../interfaces/image/UploadImageDTO'
import { authenticateToken } from '../../middlewares/auth'
import Image from '../../models/image.model'
import User from '../../models/user.model'
import { s3Client } from '../../utilities/s3Client'
import { getCurrentDateTime, getEmail } from '../../utilities/server'
import ServerResponse from '../../utilities/serverResponse'

AWS.config.update({ accessKeyId: process.env.ACCESS_KEY_ID, secretAccessKey: process.env.SECRET_ACCESS_KEY })
AWS.config.update({ region: 'us-east-1' })
const s3: AWS.S3 = new AWS.S3()

const myBucket = 'moments-gallery' // Moments Bucket
const signedUrlExpireSeconds = 86400 // 24 hours

const router = express.Router()

router
    .route('/')
    .get(authenticateToken, async (req: Request, res: Response) => {
        try {
            const imageId = req.query.imageId
            if (imageId == null) {
                return res.status(400).json(new ServerResponse('Bad Request'))
            }

            const email = getEmail(req)
            // @ts-ignore
            const user: UserModel = await User.findOne({ email })

            // @ts-ignore
            if (user.images.get(imageId) == null) {
                return res.status(400).json(new ServerResponse('Bad Request'))
            }

            // @ts-ignore
            const image: ImageModel = await Image.findOne({ _id: imageId })

            if (image) {
                // Create the command.
                const command = new GetObjectCommand({
                    Bucket: myBucket,
                    Key: `${email}/${imageId}.${image.format}`,
                })

                // Create the presigned URL.
                const presignedUrl = await getSignedUrl(s3Client, command, {
                    expiresIn: signedUrlExpireSeconds,
                })

                return res
                    .status(200)
                    .json(new ServerResponse('Image Data Retrieved').setData({ presignedUrl }).addData({ image }))
            } else {
                return res.status(400).json(new ServerResponse('Bad Request'))
            }
        } catch (e) {
            console.error(e)
            return res.status(500).json(new ServerResponse(String(e)))
        }
    })
    .post(authenticateToken, async (req: Request, res: Response) => {
        try {
            const uploadImageDTO: UploadImageDTO = req.body
            const email = getEmail(req)
            const dateTime = getCurrentDateTime()

            const newImage = new Image({
                title: uploadImageDTO.title,
                format: uploadImageDTO.format,
                size: uploadImageDTO.size,
                caption: uploadImageDTO.caption,
                tags: uploadImageDTO.tags,
                location: uploadImageDTO.location || 'N/A',
                lastModifiedDateTime: dateTime,
                uploadedDateTime: dateTime,
            })

            const imageId = newImage._id.toString()

            if (await newImage.save()) {
                // @ts-ignore
                const user: UserModel = await User.findOne({ email })

                // @ts-ignore
                const images = Object.fromEntries(user._doc.images)
                images[imageId] = imageId

                await User.updateOne({ email }, { $set: { images } })

                const command = new PutObjectCommand({
                    Bucket: myBucket,
                    Key: `${email}/${imageId}.${uploadImageDTO.format}`,
                })

                const presignedUrl = await getSignedUrl(s3Client, command, {
                    expiresIn: signedUrlExpireSeconds,
                })

                if (user) {
                    return res
                        .status(201)
                        .json(new ServerResponse('Image Uploaded Successfully').setData({ presignedUrl }))
                } else {
                    return res.status(502).json(new ServerResponse('Uh oh something went wrong :('))
                }
            } else {
                return res.status(400).json(new ServerResponse('Bad Request'))
            }
        } catch (e) {
            console.error(e)
            return res.status(500).json(new ServerResponse(String(e)))
        }
    })
    .put(authenticateToken, async (req: Request, res: Response) => {
        try {
            const email = getEmail(req)
            const updateImageDTO: UpdateImageDTO = req.body

            if (updateImageDTO.title === '' || updateImageDTO.caption === '') {
                return res.status(400).json(new ServerResponse('Title/Caption is Required'))
            }

            if (await Image.findOneAndUpdate({ _id: updateImageDTO.id, email }, { ...updateImageDTO })) {
                return res.status(200).json(new ServerResponse('Image Updated Successfully'))
            } else {
                return res.status(400).json(new ServerResponse('Bad Request'))
            }
        } catch (e) {
            console.error(e)
            return res.status(500).json(new ServerResponse(String(e)))
        }
    })
    .delete(authenticateToken, async (req: Request, res: Response) => {
        try {
            const email = getEmail(req)
            const imageId = (req.body as DeleteImageDTO).id

            // @ts-ignore
            const user: UserModel = await User.findOne({ email })

            // @ts-ignore
            const images = Object.fromEntries(user._doc.images)

            delete images[imageId]

            if ((await Image.deleteOne({ _id: imageId })) && (await User.updateOne({ email }, { $set: { images } }))) {
                return res.status(204).json(new ServerResponse('Image Deleted Successfully'))
            } else {
                return res.status(400).json(new ServerResponse('Bad Request'))
            }
        } catch (e) {
            console.error(e)
            return res.status(500).json(new ServerResponse(String(e)))
        }
    })

module.exports = router
