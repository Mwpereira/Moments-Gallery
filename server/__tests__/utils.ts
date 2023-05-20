import { faker } from '@faker-js/faker'
import request from 'supertest'
import app from '../src'
import { LoginUserDTO } from '../src/interfaces/auth/LoginUserDTO'
import { RegisterUserDTO } from '../src/interfaces/auth/RegisterUserDTO'

const deleteUserApiRoute = '/api/user'
const loginApiRoute = '/api/auth/login'
const registerApiRoute = '/api/auth/register'

const createUserDTO = (email: string, displayName: string, password: string): RegisterUserDTO => {
    return { email, displayName, password }
}

const loginUserObject = (email: string, password: string): LoginUserDTO => {
    return { email, password }
}

export const createUser = async (keepDisplayName: boolean): Promise<LoginUserDTO | RegisterUserDTO> => {
    const tempUser: any = createUserDTO(faker.internet.email(), faker.name.firstName(), faker.datatype.string(7))
    console.log(tempUser)
    const result = await request(app).post(registerApiRoute).send(tempUser)
    if (result.statusCode !== 201) {
        throw 1
    }
    if (keepDisplayName) {
        return tempUser
    }
    delete tempUser.displayName
    return loginUserObject(tempUser.email, tempUser.password)
}

export const loginUser = async (user: LoginUserDTO | RegisterUserDTO) => {
    return request(app).post(loginApiRoute).send(user)
}

export const deleteUser = async (jwt: string) => {
    const result = await request(app).delete(deleteUserApiRoute).set('Authorization', jwt)
    if (result.statusCode !== 200) {
        return 1
    }
}

export const getJwt = (result: any) => {
    const cookieHeader = result.headers['set-cookie'][0]
    return cookieHeader.substring(12, cookieHeader.indexOf('; Path'))
}
