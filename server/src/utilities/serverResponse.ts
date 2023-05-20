export default class ServerResponse {
    private data?: object
    private msg!: string

    constructor(msg: string, data?: object) {
        this.msg = msg
        if (data) {
            this.data = data
        }
    }

    setMsg(msg: string): ServerResponse {
        this.msg = msg
        return this
    }

    addData(data: object): ServerResponse {
        this.data = { ...this.data, ...data }
        return this
    }

    setData(data: object): ServerResponse {
        this.data = data
        return this
    }
}
