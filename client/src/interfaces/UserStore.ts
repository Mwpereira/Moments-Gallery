import { UpdateImageFormDTO } from '../components/PhotoCard'
import { User } from './User'

export interface UserStore {
    isAvatarLoaded: boolean
    setIsAvatarLoaded: (input: boolean) => void
    user: User
    setUser: (user: User) => void
    removeUser: () => void
    loggedIn: boolean
    setLoggedIn: (val: boolean) => void
    updateUser: (updatedUser: User) => void
    updateImagesList: (newImagesList: any[]) => void
    deleteImage: (imageId: string) => void
    addImage: (image: any) => void
    updateProfilePicture: (pictureURL: string) => void
    updateImageInfo: (newImageInfo: UpdateImageFormDTO) => void
}
