import { Request } from 'express'
import * as jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET as string
const serverMode = process.env.SERVER_MODE as string

export default class Jwt {
    /**
     * Generates JWT For Protected Routes
     *
     * @param email
     * @return JWT
     */
    static async generateJwt(email: string): Promise<string> {
        return new Promise((resolve) => {
            resolve(
                jwt.sign(
                    {
                        sub: email,
                    },
                    secret,
                    {
                        expiresIn: '4h',
                    },
                ),
            )
        })
    }

    /**
     * Expires JWT For Protected Routes
     *
     * @return JWT
     */
    static expireJwt(): string {
        return ''
    }

    /**
     * Gets accessToken from Cookie
     */
    static getAccessTokenCookie(req: Request): Promise<string> {
        return new Promise((resolve) => {
            if (serverMode === 'PRODUCTION') {
                resolve(req.cookies.accessToken)
            } else {
                const testReq = req
                // @ts-ignore
                resolve(req.headers['authorization'])
            }
        })
    }
}
