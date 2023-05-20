import axios from 'axios'
import { UpdateImageFormDTO } from '../../components/PhotoCard'
import { UploadFormDTO } from '../../components/UploadModal'
import { AvatarFormatDTO } from '../../pages/Profile'
import { DeleteImageDTO } from '../../pages/Uploads'
import { getUrl } from '../../utils/WebsiteUtils'

axios.defaults.baseURL = getUrl()

if (axios.defaults.baseURL?.includes('localhost')) {
    axios.defaults.headers.common['Authorization'] = process.env.REACT_APP_ACCESS_TOKEN || ''
}

export const uploadImage = async (data: UploadFormDTO): Promise<Response> => {
    return await axios.post('/image', data)
}

export const uploadAvatarImage = async (data: AvatarFormatDTO): Promise<Response> => {
    return await axios.put('/user/avatar', data)
}

export const uploadImageToS3 = async (
    image: any,
    presignedUrl: string,
    imageExt: string,
): Promise<Response | undefined> => {
    // Using Vanilla JS Fetch since Ky/Axios has issues handling files
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'image/' + imageExt)

    const requestOptions = {
        body: image,
        headers: myHeaders,
        method: 'PUT',
        redirect: 'follow',
    }

    let responseFinal

    await fetch(
        presignedUrl,
        // @ts-ignore
        requestOptions,
    )
        .then((response) => {
            responseFinal = response
        })
        .catch((error) => error.response)

    return responseFinal
}

export const getAllImages = async (): Promise<Response> => {
    return await axios.get('/images')
}

export const deleteImage = async (imageIDObj: DeleteImageDTO): Promise<Response> => {
    return await axios.delete('/image', { data: imageIDObj })
}

export const updateImageInfo = async (newImageInfo: UpdateImageFormDTO): Promise<Response> => {
    newImageInfo.tags = newImageInfo.tags.toString()
    return await axios.put('/image', newImageInfo)
}
