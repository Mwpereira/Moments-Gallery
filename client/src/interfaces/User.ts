import { Image } from './Image'

export interface User {
    displayName: string
    email: string
    images: Image[]
    firstName?: string
    lastName?: string
    profilePictureURL: string
}
