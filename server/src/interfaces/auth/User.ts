import { ImagesMap } from '../image/ImagesMap'

export interface UserModel {
    email: string
    password: string
    displayName: string
    images: ImagesMap
    firstName: string
    lastName: string
    avatarImageExtension: string
    lastLoginDateTime: number
    createdDateTime: number
}
