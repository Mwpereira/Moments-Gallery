import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { UserStore } from '../interfaces/UserStore'
// eslint-disable-next-line
import { UpdateImageFormDTO } from '../components/PhotoCard'
import { Image } from '../interfaces/Image'
import { User } from '../interfaces/User'

const initialUserState: User = {
    displayName: '',
    email: '',
    images: [],
    profilePictureURL: '',
}

const useStore = create<UserStore>()(
    devtools(
        persist(
            (set) => ({
                //imageObj to be switched to type Image instead of any once we have proper format
                addImage: (imageObj: any) =>
                    set((state) => ({
                        ...state,
                        user: {
                            ...state.user,
                            images: [...state.user.images].concat(imageObj),
                        },
                    })),
                deleteImage: (imageId: string) =>
                    set((state) => ({
                        ...state,
                        user: {
                            ...state.user,
                            images: state.user.images.filter((imageObj: Image) => imageObj.id != imageId),
                        },
                    })),
                isAvatarLoaded: true,
                loggedIn: false,
                removeUser: () =>
                    set((state) => ({
                        ...state,
                        loggedIn: false,
                        user: initialUserState,
                    })),
                setIsAvatarLoaded: (isLoaded: boolean) =>
                    set((state) => ({
                        ...state,
                        isAvatarLoaded: isLoaded,
                    })),
                setLoggedIn: (val: boolean) => set((state) => ({ ...state, loggedIn: val })),
                setUser: (user: User) => set((state) => ({ ...state, user: user })),
                updateImageInfo: (info: UpdateImageFormDTO) =>
                    set((state) => ({
                        ...state,
                        user: {
                            ...state.user,
                            images: [...state.user.images].map((image: Image) => {
                                if (image.id === info.id) {
                                    const updatedImg: Image = image
                                    updatedImg.caption = info.caption
                                    updatedImg.location = info.location
                                    updatedImg.title = info.title
                                    updatedImg.tags = info.tags
                                    return updatedImg
                                } else {
                                    return image
                                }
                            }),
                        },
                    })),
                updateImagesList: (newImages: any[]) =>
                    set((state) => ({
                        ...state,
                        user: {
                            ...state.user,
                            images: newImages,
                        },
                    })),
                updateProfilePicture: (pictureURL: string) =>
                    set((state) => ({
                        ...state,
                        user: {
                            ...state.user,
                            profilePictureURL: pictureURL,
                        },
                    })),
                updateUser: (updatedUser: User) =>
                    set((state) => ({
                        ...state,
                        user: {
                            ...state.user,
                            firstName: updatedUser.firstName,
                            lastName: updatedUser.lastName,
                        },
                    })),
                user: initialUserState,
            }),
            {
                name: 'Moments-store',
            },
        ),
    ),
)

export default useStore
