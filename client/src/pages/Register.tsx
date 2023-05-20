import { ArrowForwardIcon, CheckCircleIcon } from '@chakra-ui/icons'
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogOverlay,
    Box,
    Button,
    Center,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Icon,
    Image,
    Input,
    Link,
    ScaleFade,
    Stack,
    Text,
    useColorMode,
    useDisclosure,
    VStack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link as ReactLink, useNavigate } from 'react-router-dom'
import logo from '../assets/images/logo_transparent.png'
import { registerUser } from '../services/api/auth-service'
import { successResponse } from '../utils/ResponseUtils'

export type RegisterFormDTO = {
    email: string
    password: string
    confirm_password: string
    displayName: string
}

export default function Register() {
    const navigate = useNavigate()
    const { colorMode } = useColorMode()
    const [isLoading, setIsLoading] = useState(false)
    const [generalError, setGeneralError] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef() as React.MutableRefObject<HTMLInputElement>
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm<RegisterFormDTO>()
    const minPassLength: number = 7
    const minUsernameLength: number = 3

    const handleSubmitForm = async (data: RegisterFormDTO) => {
        setGeneralError(false)
        setIsLoading(true)
        try {
            if (successResponse(await registerUser(data))) {
                reset()
                onOpen()
                setIsLoading(false)
            } else {
                // Set error response here
            }
        } catch (error) {
            setGeneralError(true)
            setIsLoading(false)
        }
    }

    return (
        <>
            <Center h={'100vh'} marginTop={['5rem', '7rem', '0', '0']} padding={['0rem', '0.5rem', '3rem', '5rem']}>
                <ScaleFade in initialScale={0.9}>
                    <Box boxShadow="2xl">
                        <Flex direction={{ base: 'column', md: 'row' }}>
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
                                        <Heading fontSize={'4xl'} textAlign={'center'}>
                                            Sign Up
                                        </Heading>
                                        <FormControl isInvalid={Boolean(errors.displayName)} margin={'1rem'}>
                                            <FormLabel>Display Name</FormLabel>
                                            <Input
                                                {...register('displayName', {
                                                    minLength: {
                                                        message: `Minimum ${minUsernameLength} characters required`,
                                                        value: minUsernameLength,
                                                    },
                                                    required: 'Please enter a valid username',
                                                })}
                                                shadow={'md'}
                                                type="string"
                                            />
                                            <FormErrorMessage>
                                                {errors.displayName && errors.displayName.message}
                                            </FormErrorMessage>
                                        </FormControl>

                                        <FormControl isInvalid={Boolean(errors.email)} margin={'1rem'}>
                                            <FormLabel>Email</FormLabel>
                                            <Input
                                                {...register('email', {
                                                    required: 'Please enter a valid email',
                                                })}
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

                                        <FormControl isInvalid={Boolean(errors.confirm_password)}>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <Input
                                                {...register('confirm_password', {
                                                    required: 'Please re-enter your password',
                                                    validate: (val: string) => {
                                                        if (watch('password') != val) {
                                                            return 'Your passwords do no match'
                                                        }
                                                    },
                                                })}
                                                shadow={'md'}
                                                type="password"
                                            />
                                            <FormErrorMessage>
                                                {errors.confirm_password && errors.confirm_password.message}
                                            </FormErrorMessage>
                                            <Text color="tomato" textAlign="center">
                                                {generalError ? 'Something went wrong please try again!' : null}
                                            </Text>
                                        </FormControl>
                                        <Stack paddingTop={'1rem'} spacing={10}>
                                            <Center>
                                                <Button
                                                    colorScheme={'blue'}
                                                    isLoading={isLoading}
                                                    loadingText={'Registering user...'}
                                                    shadow={'xl'}
                                                    type="submit"
                                                    variant={'solid'}
                                                    width={'80%'}
                                                >
                                                    Sign up
                                                </Button>
                                            </Center>
                                            <Text fontSize="md" textAlign={'center'}>
                                                Existing user?{' '}
                                                <Link as={ReactLink} color={'blue.500'} to="/login">
                                                    Log in!
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
            <AlertDialog
                isCentered
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                motionPreset="slideInBottom"
                onClose={onClose}
            >
                <AlertDialogOverlay />
                <AlertDialogContent>
                    <AlertDialogCloseButton />
                    <Center bg="green.400" borderTopRadius={'md'} color="white" h="12rem" w="100%">
                        <Icon as={CheckCircleIcon} h={24} w={24} />
                    </Center>
                    <AlertDialogBody>
                        <VStack spacing={4}>
                            <Center>
                                <Text as="b" fontSize="4xl">
                                    {' '}
                                    Great!{' '}
                                </Text>
                            </Center>
                            <Center>
                                <Text fontSize="lg"> Your account has been created successfully. </Text>
                            </Center>
                        </VStack>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button
                            colorScheme="gray"
                            onClick={() => {
                                navigate('/login')
                            }}
                            rightIcon={<ArrowForwardIcon />}
                            variant="outline"
                        >
                            Sign In
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
