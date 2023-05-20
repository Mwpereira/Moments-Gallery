import { compare, genSalt, hash } from 'bcryptjs'

export const getHashedValue = async (secret: string): Promise<string> => {
    return hash(secret, await genSalt(12))
}

export const validatePassword = async (actual: string, expected: string): Promise<boolean> => {
    return compare(actual, expected)
}
