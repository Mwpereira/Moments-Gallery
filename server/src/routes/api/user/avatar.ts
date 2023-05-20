import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import express, { Request, Response } from 'express'
import { UpdateAvatarImageDTO } from '../../../interfaces/user/UpdateAvatarImageDTO'
import { authenticateToken } from '../../../middlewares/auth'
import User from '../../../models/user.model'
import { s3Client } from '../../../utilities/s3Client'
import { getEmail } from '../../../utilities/server'
import ServerResponse from '../../../utilities/serverResponse'

const myBucket = 'moments-gallery' // Moments Bucket
const signedUrlExpireSeconds = 86400 // 24 hours

const router = express.Router()

router.route('/').put(authenticateToken, async (req: Request, res: Response) => {
    try {
        const updateAvatarImage: UpdateAvatarImageDTO = req.body

        const command = new PutObjectCommand({
            Bucket: myBucket,
            Key: `${getEmail(req)}/avatar.${updateAvatarImage.format}`,
        })

        const presignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: signedUrlExpireSeconds,
        })

        await User.findOneAndUpdate(
            { email: getEmail(req) },
            { $set: { avatarImageExtension: updateAvatarImage.format } },
        )

        return res.status(200).json(new ServerResponse('Avatar Data Retrieved').setData({ presignedUrl }))
    } catch (e) {
        console.error(e)
        return res.status(500).json(new ServerResponse(String(e)))
    }
})

module.exports = router
