import { Request } from 'express'

export const getEmail = (req: Request) => {
    //@ts-ignore
    return req.email
}

export const getCurrentDateTime = () => {
    return Math.floor(new Date().getTime() / 1000.0) //Epoch in milliseconds
}
