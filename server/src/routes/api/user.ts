import express, { Request, Response } from 'express'

import { SanitizedUser } from '../../interfaces/auth/SanitizedUser'
import { UserModel } from '../../interfaces/auth/User'
import { UpdateUserDTO } from '../../interfaces/user/UpdateUserDTO'
import { authenticateToken } from '../../middlewares/auth'
import User from '../../models/user.model'
import Cookie from '../../utilities/cookie'
import Jwt from '../../utilities/jwt'
import { getEmail } from '../../utilities/server'
import ServerResponse from '../../utilities/serverResponse'

const router = express.Router()

router
    .route('/')
    .get(authenticateToken, async (req: Request, res: Response) => {
        try {
            const userDb = await User.findOne({ email: getEmail(req) })
            if (userDb) {
                //@ts-ignore
                const user: UserModel = userDb._doc
                const sanitizedUser: SanitizedUser = { ...user }
                delete sanitizedUser.password
                return res.status(200).json(new ServerResponse('User Retrieved').setData({ user: sanitizedUser }))
            } else {
                return res.status(404).json(new ServerResponse('User Not Found'))
            }
        } catch (e) {
            console.error(e)
            return res.status(500).json(new ServerResponse(String(e)))
        }
    })
    .put(authenticateToken, async (req: Request, res: Response) => {
        try {
            const email = getEmail(req)
            const userDb = await User.findOne({ email: getEmail(req) })

            if (userDb) {
                // @ts-ignore
                const user: UserModel = userDb._doc

                const updateUserDTO: UpdateUserDTO = req.body
                const firstName = updateUserDTO.firstName
                const lastName = updateUserDTO.lastName

                if (user.firstName !== firstName) {
                    if (!(firstName.length >= 1 && firstName.length <= 18)) {
                        return res.status(400).json(new ServerResponse('First Name Under/Exceeds Character Length'))
                    }
                }

                if (user.lastName !== lastName) {
                    if (!(lastName.length >= 1 && lastName.length <= 18)) {
                        return res.status(400).json(new ServerResponse('Last Name Under/Exceeds Character Length'))
                    }
                }

                if (await User.findOneAndUpdate({ email }, { ...updateUserDTO })) {
                    return res.status(200).json(new ServerResponse('User Updated'))
                } else {
                    return res.status(500).json(new ServerResponse('Server Error'))
                }
            } else {
                return res.status(404).json(new ServerResponse('User Not Found'))
            }
        } catch (e) {
            console.error(e)
            return res.status(500).json(new ServerResponse(String(e)))
        }
    })
    .delete(authenticateToken, async (req: Request, res: Response) => {
        try {
            if (await User.findOneAndDelete({ email: getEmail(req) })) {
                const cookieWithJwt = new Cookie(Jwt.expireJwt()).generateCookie()
                return res.setHeader('Set-Cookie', cookieWithJwt).status(200).json(new ServerResponse('User Deleted'))
            } else {
                return res.status(404).json(new ServerResponse('User Not Found'))
            }
        } catch (e) {
            console.error(e)
            return res.status(500).json(new ServerResponse(String(e)))
        }
    })

module.exports = router
