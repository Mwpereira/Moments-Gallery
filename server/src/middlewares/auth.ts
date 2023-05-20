import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'

import Jwt from '../utilities/jwt'
import ServerResponse from '../utilities/serverResponse'

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = await Jwt.getAccessTokenCookie(req)

        if (accessToken == null || accessToken === '')
            return res.status(401).json(new ServerResponse('Could not retrieve access token'))

        jwt.verify(accessToken, process.env.JWT_SECRET as string, (err: any, user: any) => {
            if (err) return res.status(403).json(new ServerResponse('Invalid access token'))

            //@ts-ignore - Required since email key does not exist in express' 'Request' interface
            req.email = user.sub

            next()
        })
    } catch (e) {
        return res.status(500).json(new ServerResponse('Server Error'))
    }
}
