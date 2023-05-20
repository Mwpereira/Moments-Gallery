import { model, Schema } from 'mongoose'

import { ImageModel } from '../interfaces/image/Image'

const imageSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxLength: 32,
    },
    format: {
        type: String,
        required: true,
        minlength: 3,
        maxLength: 4,
    },
    size: {
        type: String,
        required: true,
        trim: true,
    },
    caption: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxLength: 120,
    },
    tags: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    lastModifiedDateTime: {
        type: Number,
        required: true,
    },
    uploadedDateTime: {
        type: Number,
        required: true,
    },
})

const Image = model<ImageModel>('Image', imageSchema)

export default Image
