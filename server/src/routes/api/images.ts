import express, { Request, Response } from 'express'

import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { UserModel } from '../../interfaces/auth/User'
import { authenticateToken } from '../../middlewares/auth'
import Image from '../../models/image.model'
import User from '../../models/user.model'
import { s3Client } from '../../utilities/s3Client'
import { getEmail } from '../../utilities/server'
import ServerResponse from '../../utilities/serverResponse'

const myBucket = 'moments-gallery' // Moments Bucket
const signedUrlExpireSeconds = 86400 // 24 hours

const router = express.Router()

router.route('/').get(authenticateToken, async (req: Request, res: Response) => {
    try {
        const email = getEmail(req)

        // @ts-ignore
        const user: UserModel = await User.findOne({ email })
        // @ts-ignore
        const userImages: string[] = Object.keys(Object.fromEntries(user._doc.images))

        const images = {}

        for (let i = 0; i < userImages.length; i++) {
            const imageDb = await Image.findOne({ _id: userImages[i] })
            // @ts-ignore
            images[userImages[i]] = {
                data: imageDb,
                // @ts-ignore
                presignedUrl: await getPresignedUrl(email, imageDb._id, imageDb.format),
            }
        }

        return res.status(200).json(new ServerResponse('Images Retrieved').setData({ images }))
    } catch (e) {
        console.error(e)
        return res.status(500).json(new ServerResponse(String(e)))
    }
})

async function getPresignedUrl(email: string, id: string, format: string) {
    const command = new GetObjectCommand({
        Bucket: myBucket,
        Key: `${email}/${id}.${format}`,
    })

    return await getSignedUrl(s3Client, command, {
        expiresIn: signedUrlExpireSeconds,
    })
}

module.exports = router
