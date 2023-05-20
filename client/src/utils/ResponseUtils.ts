export const successResponse = (response: Response): boolean => {
    return response.status >= 200 && response.status < 400
}

export const unauthorizedAuthResponse = (response: Response): boolean => {
    return response.status === 401
}

export const unauthorizedResponse = (response: Response): boolean => {
    return response.status === 401 || response.status === 403
}

export const serverDownResponse = (response: Response): boolean => {
    return response.status >= 500
}

export const getMessage = async (response: Response): Promise<string> => {
    const body = await response.json()
    return body.message
}

export const getErrorMessage = async (response: Response): Promise<string> => {
    const body = await response.json()
    return body.errors ? body.errors[0].defaultMessage : body.message
}
