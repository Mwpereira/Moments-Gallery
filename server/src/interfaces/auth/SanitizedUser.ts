import { ImagesMap } from '../image/ImagesMap'

export interface SanitizedUser {
    email: string
    password?: string
    displayName: string
    firstName: string | undefined
    lastName: string | undefined
    images: ImagesMap
    lastLoginDateTime: number
    createdDateTime: number
}
