import { faker } from '@faker-js/faker'
import { afterAll, beforeAll, expect } from '@jest/globals'
import request from 'supertest'
import app from '../src'
import { LoginUserDTO } from '../src/interfaces/auth/LoginUserDTO'
import { RegisterUserDTO } from '../src/interfaces/auth/RegisterUserDTO'
import { SanitizedUser } from '../src/interfaces/auth/SanitizedUser'
import { UpdateUserDTO } from '../src/interfaces/user/UpdateUserDTO'
import { createUser, deleteUser, getJwt, loginUser } from './utils'

const userApiRoute = '/api/user'

let user: LoginUserDTO | RegisterUserDTO
let jwt: string
let validUpdateUserDTO: UpdateUserDTO = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
}

describe('/user - User API endpoint', () => {
    beforeAll(async () => {
        user = await createUser(true)
        jwt = getJwt(await loginUser(user))
    })
    it('Successful Get User API Request', async () => {
        const result = await request(app).get(userApiRoute).set('Authorization', jwt)
        expect(result.body.msg).toEqual('User Retrieved')
        expect(result.statusCode).toEqual(200)
        const userFromResponse: SanitizedUser = result.body.data.user
        expect(userFromResponse.email).toEqual(user.email)
    })
    it('Successful Update User API Request', async () => {
        const result = await request(app).put(userApiRoute).send(validUpdateUserDTO).set('Authorization', jwt)
        expect(result.body.msg).toEqual('User Updated')
        expect(result.statusCode).toEqual(200)
    })
    it('Incorrect First Name For Update User API Request', async () => {
        let result = await request(app)
            .put(userApiRoute)
            .send({ firstName: faker.datatype.string(0), lastName: validUpdateUserDTO.lastName })
            .set('Authorization', jwt)
        expect(result.body.msg).toEqual('First Name Under/Exceeds Character Length')
        expect(result.statusCode).toEqual(400)

        result = await request(app)
            .put(userApiRoute)
            .send({ firstName: faker.datatype.string(19), lastName: validUpdateUserDTO.lastName })
            .set('Authorization', jwt)
        expect(result.body.msg).toEqual('First Name Under/Exceeds Character Length')
        expect(result.statusCode).toEqual(400)
    })
    it('Incorrect Last Name For Update User API Request', async () => {
        let result = await request(app)
            .put(userApiRoute)
            .send({ firstName: validUpdateUserDTO.firstName, lastName: faker.datatype.string(0) })
            .set('Authorization', jwt)
        expect(result.body.msg).toEqual('Last Name Under/Exceeds Character Length')
        expect(result.statusCode).toEqual(400)

        result = await request(app)
            .put(userApiRoute)
            .send({ firstName: validUpdateUserDTO.firstName, lastName: faker.datatype.string(19) })
            .set('Authorization', jwt)
        expect(result.body.msg).toEqual('Last Name Under/Exceeds Character Length')
        expect(result.statusCode).toEqual(400)
    })
    afterAll(async () => {
        await deleteUser(jwt)
    })
})
