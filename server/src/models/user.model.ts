import { model, Schema } from 'mongoose'

import { UserModel } from '../interfaces/auth/User'

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxLength: 32,
    },
    // Hashed Password Gets Stored Here
    password: {
        type: String,
        required: true,
        trim: true,
    },
    avatarImageExtension: {
        type: String,
        trim: true,
        minlength: 3,
        maxLength: 4,
    },
    displayName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxLength: 18,
    },
    firstName: {
        type: String,
        required: false,
        trim: true,
        minlength: 1,
        maxLength: 18,
    },
    images: {
        type: Map,
        required: true,
    },
    lastLoginDateTime: {
        type: Number,
        required: true,
    },
    lastName: {
        type: String,
        required: false,
        trim: true,
        minlength: 1,
        maxLength: 18,
    },
    createdDateTime: {
        type: Number,
        required: true,
    },
})

const User = model<UserModel>('User', userSchema)

export default User
