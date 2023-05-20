const cookie = require('cookie')

export default class Cookie {
    private readonly jwt: string
    private readonly expires = new Date(Date.now() + 60 * 60 * 1000)
    private readonly path = '/'
    private readonly sameSite = process.env.SERVER_MODE === 'PRODUCTION' ? 'NONE' : null
    private readonly secure = process.env.SERVER_MODE === 'PRODUCTION' ? true : null
    private readonly httpOnly = true

    constructor(jwt: string) {
        this.jwt = jwt
    }

    /**
     * Generates JWT Cookie
     *
     * @return JWT cookie buffer
     */
    generateCookie(): string {
        return cookie.serialize('accessToken', this.jwt, {
            expires: this.expires,
            path: this.path,
            sameSite: this.sameSite,
            secure: this.secure,
            httpOnly: this.httpOnly,
        })
    }
}
