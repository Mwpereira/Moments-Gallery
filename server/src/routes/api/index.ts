import express, { Request, Response } from 'express'

const router = express.Router()

router.get('/health', async (req: Request, res: Response) => {
    res.json('Server is up & running...')
})

router.use('/auth', require('./auth'))
router.use('/image', require('./image'))
router.use('/images', require('./images'))
router.use('/user', require('./user'))
router.use('/user/avatar', require('./user/avatar'))

module.exports = router
