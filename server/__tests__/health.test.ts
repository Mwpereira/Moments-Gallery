import request from 'supertest'
import app from '../src/index'

describe('/health - Simple Health API endpoint', () => {
    it('/ GET', async () => {
        const result = await request(app).get('/')
        expect(result.body.msg).toEqual('Server Online!')
        expect(result.statusCode).toEqual(200)
    })
})
