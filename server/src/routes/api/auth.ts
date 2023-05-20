import express, { Request, Response } from 'express'
import validator from 'validator'

import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { LoginUserDTO } from '../../interfaces/auth/LoginUserDTO'
import { RegisterUserDTO } from '../../interfaces/auth/RegisterUserDTO'
import { SanitizedUser } from '../../interfaces/auth/SanitizedUser'
import { UserModel } from '../../interfaces/auth/User'
import User from '../../models/user.model'
import { getHashedValue, validatePassword } from '../../utilities/bcrypt'
import Cookie from '../../utilities/cookie'
import Jwt from '../../utilities/jwt'
import { s3Client } from '../../utilities/s3Client'
import { getCurrentDateTime } from '../../utilities/server'
import ServerResponse from '../../utilities/serverResponse'

const myBucket = 'moments-gallery' // Moments Bucket
const signedUrlExpireSeconds = 300 // 5 Minutes

const router = express.Router()

/**
 * Register API
 *
 * @route    POST auth/register
 * @desc     Creates users
 * @access   Public
 */
router.route('/register').post(async (req: Request, res: Response) => {
    try {
        const user: RegisterUserDTO = req.body
        const email = user.email.toString()
        const password = user.password
        const displayName = user.displayName
        const dateTime = getCurrentDateTime()

        // Mongoose handles verifications and generates errors, although we want to handle this part
        if (!validator.isEmail(email)) {
            return res.status(400).json(new ServerResponse('Invalid Email'))
        }

        if (!(password.length >= 7 && password.length <= 32)) {
            return res.status(400).json(new ServerResponse('Invalid Password Length'))
        }

        if (await User.exists({ email })) {
            return res.status(400).json(new ServerResponse('Email Already In Use'))
        }

        if (!(displayName.length >= 3 && displayName.length <= 18)) {
            return res.status(400).json(new ServerResponse('Invalid Display Length'))
        }

        if (await User.exists({ displayName })) {
            return res.status(400).json(new ServerResponse('Display Name Already In Use'))
        }

        const hashedPassword = await getHashedValue(user.password)

        const newUser = new User({
            email,
            password: hashedPassword,
            displayName,
            images: {},
            lastLoginDateTime: dateTime,
            createdDateTime: dateTime,
        })

        if (await newUser.save()) {
            return res.status(201).json(new ServerResponse('Registered User'))
        } else {
            return res.status(400).json(new ServerResponse('Failed To Register User'))
        }
    } catch (e) {
        console.error(e)
        return res.status(500).json(new ServerResponse(String(e)))
    }
})

/**
 * Login API
 *
 * @route    POST auth/login
 * @desc     Authenticates User
 * @access   Public
 */
router.route('/login').post(async (req: Request, res: Response) => {
    try {
        const loginUserDTO: LoginUserDTO = req.body

        const userDb = await User.findOneAndUpdate(
            { email: loginUserDTO.email.toString() },
            { $set: { lastLoginDateTime: getCurrentDateTime() } },
        )

        if (userDb) {
            //@ts-ignore
            const user: UserModel = userDb._doc
            if (await validatePassword(loginUserDTO.password, user.password)) {
                const sanitizedUser: SanitizedUser = { ...user }
                delete sanitizedUser.password
                const cookieWithJwt = new Cookie(await Jwt.generateJwt(user.email)).generateCookie()

                const serverResponse: ServerResponse = new ServerResponse('Signed In')

                if (userDb.avatarImageExtension) {
                    const command = new GetObjectCommand({
                        Bucket: myBucket,
                        Key: `${userDb.email}/avatar.${userDb.avatarImageExtension}`,
                    })

                    const presignedUrl = await getSignedUrl(s3Client, command, {
                        expiresIn: signedUrlExpireSeconds,
                    })

                    serverResponse.addData({ presignedUrl })
                }

                return res
                    .setHeader('Set-Cookie', cookieWithJwt)
                    .status(202)
                    .json(serverResponse.addData({ user: sanitizedUser }))
            } else {
                return res.status(403).json(new ServerResponse('Incorrect Email/Password'))
            }
        } else {
            // User not found
            return res.status(403).json(new ServerResponse('Incorrect Email/Password'))
        }
    } catch (e) {
        console.error(e)
        res.status(500).json(new ServerResponse(String(e)))
    }
})

/**
 * Logout API
 *
 * @route    POST auth/logout
 * @desc     Expires the user's token
 * @access   Public
 */
router.route('/logout').get(async (req: Request, res: Response) => {
    try {
        const cookieWithJwt = new Cookie(Jwt.expireJwt()).generateCookie()
        return res.setHeader('Set-Cookie', cookieWithJwt).status(200).json(new ServerResponse('Signed Out'))
    } catch (e) {
        console.error(e)
        res.status(500).json(new ServerResponse(String(e)))
    }
})

module.exports = router
