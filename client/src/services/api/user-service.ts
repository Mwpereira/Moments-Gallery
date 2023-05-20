import axios from 'axios'
import { UpdateFormDTO } from '../../pages/Profile'
import { getUrl } from '../../utils/WebsiteUtils'

axios.defaults.baseURL = getUrl()

if (axios.defaults.baseURL?.includes('localhost')) {
    axios.defaults.headers.common['Authorization'] = process.env.REACT_APP_ACCESS_TOKEN || ''
}

export const getUser = async (): Promise<Response> => {
    return await axios.get('/user')
}

export const updateUser = async (data: UpdateFormDTO): Promise<Response> => {
    const userData = { firstName: data.firstName, lastName: data.lastName }
    return await axios.put('/user', userData)
}

export const deleteUser = async (): Promise<Response> => {
    return await axios.delete('/user')
}
