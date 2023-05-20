import {
    Box,
    Button,
    Center,
    Checkbox,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Image,
    Input,
    Link,
    ScaleFade,
    Stack,
    Text,
    useColorMode,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link as ReactLink, useNavigate } from 'react-router-dom'

import logo from '../assets/images/logo_transparent.png'
import { login } from '../services/api/auth-service'
import useStore from '../store/store'
// eslint-disable-next-line
import { User } from '../interfaces/User'
import { UserStore } from '../interfaces/UserStore'
import { successResponse } from '../utils/ResponseUtils'

export type LoginFormDTO = {
    email: string
    password: string
}

export default function Login() {
    const navigate = useNavigate()
    const store: UserStore = useStore()
    const { colorMode } = useColorMode()
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        reset,
    } = useForm<LoginFormDTO>()
    const [isLoading, setIsLoading] = useState(false)

    const userEmail = localStorage.getItem('$email') || undefined
    let rememberMeChecked = userEmail !== undefined

    const handleRememberMeChange = (e: any) => {
        rememberMeChecked = e.target.checked
    }

    const handleSubmitForm = async (data: LoginFormDTO) => {
        try {
            setIsLoading(true)
            const response: any = await login(data)
            if (successResponse(response)) {
                reset()
                const user: User = response.data.data.user
                store.setUser(user)
                store.updateProfilePicture(response.data.data.presignedUrl)
                store.setLoggedIn(true)
                if (rememberMeChecked) {
                    localStorage.setItem('$email', data.email)
                } else {
                    localStorage.removeItem('$email')
                }
                setIsLoading(false)
                navigate('/dashboard/home')
            } else {
                // Set error response here
            }
        } catch (error: any) {
            setIsLoading(false)
            if (error.response.data.msg === 'Incorrect Password') {
                setError('password', {
                    message: 'Wrong password!',
                })
            } else {
                setError('email', {
                    message: 'Please check your credentials!',
                })
                setError('password', {
                    message: 'Please check your credentials!',
                })
            }
        }
    }

    const minPassLength: number = 7

    return (
        <Center h={'100vh'} marginTop={['5rem', '7rem', '0', '0']} padding={['0rem', '0.5rem', '3rem', '5rem']}>
            <ScaleFade in initialScale={0.9}>
                <Box boxShadow="2xl">
                    <Flex direction={{ base: 'column', sm: 'row' }}>
                        <Flex flex={1}>
                            <Image
                                alt={'Login Image'}
                                bg={colorMode === 'light' ? 'gray.700' : 'gray.100'}
                                objectFit={'cover'}
                                src={logo}
                                w={'100%'}
                            />
                        </Flex>
                        <Flex align={'center'} flex={1} justify={'center'} p={5}>
                            <form onSubmit={handleSubmit(handleSubmitForm)} style={{ width: '80%' }}>
                                <Stack spacing={4} w={'full'}>
                                    <Heading fontSize={'4xl'} marginY={'2rem'} textAlign={'center'}>
                                        Sign in
                                    </Heading>

                                    <FormControl isInvalid={Boolean(errors.email)} margin={'1rem'}>
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            {...register('email', {
                                                required: 'Please enter a valid email',
                                            })}
                                            defaultValue={userEmail}
                                            shadow={'md'}
                                            type="email"
                                        />
                                        <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={Boolean(errors.password)}>
                                        <FormLabel>Password</FormLabel>
                                        <Input
                                            {...register('password', {
                                                minLength: {
                                                    message: `Minimum of ${minPassLength} characters required`,
                                                    value: minPassLength,
                                                },
                                                required: 'Please enter a valid password',
                                            })}
                                            shadow={'md'}
                                            type="password"
                                        />
                                        <FormErrorMessage>
                                            {errors.password && errors.password.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                    <Stack spacing={10}>
                                        <Stack
                                            align={'start'}
                                            direction={{ base: 'column', sm: 'row' }}
                                            justify={'space-between'}
                                        >
                                            <Checkbox
                                                defaultChecked={rememberMeChecked}
                                                onChange={(e) => handleRememberMeChange(e)}
                                            >
                                                Remember me
                                            </Checkbox>
                                            <Link color={'blue.500'}>Forgot password?</Link>
                                        </Stack>
                                        <Center>
                                            <Button
                                                colorScheme={'blue'}
                                                isLoading={isLoading}
                                                loadingText="Logging in..."
                                                shadow={'xl'}
                                                type="submit"
                                                variant={'solid'}
                                                width={'80%'}
                                            >
                                                Sign in
                                            </Button>
                                        </Center>
                                        <Text
                                            // paddingBottom={'1rem'}
                                            fontSize="md"
                                            textAlign={'center'}
                                        >
                                            Don’t have an account?{' '}
                                            <Link as={ReactLink} color={'blue.500'} to="/register">
                                                Sign Up
                                            </Link>
                                        </Text>
                                    </Stack>
                                </Stack>
                            </form>
                        </Flex>
                    </Flex>
                </Box>
            </ScaleFade>
        </Center>
    )
}
