import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Avatar,
    Box,
    Button,
    Center,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    HStack,
    Input,
    Link,
    SkeletonCircle,
    Stack,
    Tag,
    Text,
    useDisclosure,
    useToast,
    VStack,
    Wrap,
    WrapItem,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { deleteUser, updateUser } from '../services/api/user-service'
import useStore from '../store/store'
import { successResponse } from '../utils/ResponseUtils'
// eslint-disable-next-line
import { useNavigate } from 'react-router-dom'
import { User } from '../interfaces/User'
import { uploadAvatarImage, uploadImageToS3 } from '../services/api/image-service'

export type UpdateFormDTO = {
    email: string
    firstName: string
    lastName: string
    displayName: string
}

export type AvatarFormatDTO = {
    format: string
}

export const Profile = () => {
    const store = useStore()
    const toast = useToast()
    const { onClose, isOpen, onOpen } = useDisclosure()
    const cancelRef = useRef<HTMLButtonElement>(null)
    const {
        register,
        handleSubmit,
        formState: { errors },
        resetField,
    } = useForm<UpdateFormDTO>()
    const user = store.user
    const minNameLength: number = 2
    const navigate = useNavigate()

    const userName = (user.firstName && user.lastName ? user.firstName + ' ' + user.lastName : '') || ''

    const [loading, setLoading] = useState(false)

    const capitalizeFirstChar = (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    const resetForm = () => {
        resetField('firstName')
        resetField('lastName')
    }

    const handleProfileUpload = async (e: any) => {
        store.setIsAvatarLoaded(false)
        const file: File = e.currentTarget.files[0]
        const imageFormat = file.type.split('/')[1]

        let fileReader = new FileReader()
        let imagebytes = null
        fileReader.onload = () => {
            imagebytes = fileReader.result
        }
        fileReader.readAsDataURL(file)

        try {
            const fileFormat: AvatarFormatDTO = { format: imageFormat }
            let getPresignedURLResponse: any = await uploadAvatarImage(fileFormat)
            if (successResponse(getPresignedURLResponse)) {
                const presignedURL = getPresignedURLResponse.data.data.presignedUrl
                //@ts-ignore
                const binary = atob(imagebytes.split(',')[1])
                const array = []
                for (let i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i))
                }

                const uploadToS3Response: any = await uploadImageToS3(
                    new Blob([new Uint8Array(array)], { type: 'image/' + imageFormat }),
                    presignedURL,
                    imageFormat,
                )
                if (successResponse(uploadToS3Response)) {
                    toast({
                        duration: 5000,
                        isClosable: true,
                        status: 'success',
                        title: 'Image uploaded successfully!',
                    })

                    //Once the file upload is successful update the local store
                    let url = URL.createObjectURL(file)
                    store.updateProfilePicture(url)

                    //Update the skeleton from onloading to loaded
                    store.setIsAvatarLoaded(true)
                } else {
                    toast({
                        duration: 5000,
                        isClosable: true,
                        status: 'error',
                        title: 'Image failed to upload',
                    })
                    store.setIsAvatarLoaded(true)
                }
            } else {
                toast({
                    duration: 5000,
                    isClosable: true,
                    status: 'error',
                    title: 'Failed to get Presigned URL from AWS',
                })
                store.setIsAvatarLoaded(true)
            }
        } catch (error) {
            toast({
                duration: 5000,
                isClosable: true,
                status: 'error',
                title: error + '',
            })
            store.setIsAvatarLoaded(true)
        }
    }

    const showToast = (status: string) => {
        const title = status === 'success' ? 'User updated.' : 'User update failed.'
        const description = status === 'success' ? "We've successfully updated your info." : 'Something went wrong.'
        const statusT = status === 'success' ? 'success' : 'error'

        return toast({
            description: description,
            duration: 3000,
            isClosable: true,
            status: statusT,
            title: title,
        })
    }

    const handleSubmitForm = async (data: UpdateFormDTO) => {
        setLoading(true)
        const formData: UpdateFormDTO = {
            ...data,
            displayName: user.displayName,
            email: user.email,
            firstName: capitalizeFirstChar(data.firstName),
            lastName: capitalizeFirstChar(data.lastName),
        }

        try {
            const updateUserResponse = await updateUser(formData)
            if (successResponse(updateUserResponse)) {
                const updatedUserData: User = {
                    ...user,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                }
                store.updateUser(updatedUserData)
                showToast('success')
                setLoading(false)
            }
        } catch (error) {
            showToast('error')
            setLoading(false)
        }
    }

    const deleteUserHandler = async () => {
        const deleteUserResponse: any = await deleteUser()
        if (successResponse(deleteUserResponse)) {
            store.removeUser()
            toast({
                description: "User deleted!\nWe're sorry to see you go 😕",
                duration: 3000,
                isClosable: true,
                status: 'success',
                title: 'Success!',
            })
            onClose()
            setTimeout(() => {
                navigate('login')
            }, 3000)
        } else {
            onClose()
            toast({
                description: 'Something went wrong!',
                duration: 3000,
                isClosable: true,
                status: 'error',
                title: 'Error!',
            })
        }
    }

    return (
        <>
            <Flex
                direction={'column'}
                padding={['1rem', '3rem', '4rem', '5rem']}
                paddingX={['1rem', '2rem', '3rem', '7rem']}
                scrollBehavior={'auto'}
            >
                <Wrap
                    align={'center'}
                    cursor="default"
                    direction={['column', 'column', 'row', 'row']}
                    paddingBottom={'2rem'}
                    spacing={['1rem', '1rem', '2rem', '2rem']}
                >
                    <WrapItem>
                        <SkeletonCircle fadeDuration={2} isLoaded={store.isAvatarLoaded} size="5rem">
                            <Avatar size="xl" src={user.profilePictureURL} />
                        </SkeletonCircle>
                    </WrapItem>
                    <Stack
                        alignItems={['center', 'center', 'normal', 'normal']}
                        direction={'column'}
                        justifyContent="center"
                    >
                        <Heading as="h1" noOfLines={1} size={'xl'}>
                            {userName.length > 0 ? userName : ''}
                        </Heading>
                        <Tag colorScheme="blue" rounded="full" size={'md'} width={'-webkit-fit-content'}>
                            {'@' + user.displayName}
                        </Tag>
                    </Stack>
                </Wrap>
                <form onSubmit={handleSubmit(handleSubmitForm)}>
                    <Box>
                        <VStack align="left" spacing={'1rem'}>
                            <Box borderBottomWidth="2px">
                                <Text as="b" fontSize="xl">
                                    User Info
                                </Text>
                            </Box>
                            <Flex justifyContent={'space-around'}>
                                <Box paddingRight="1rem" style={{ width: '100%' }}>
                                    <FormControl isInvalid={Boolean(errors.firstName)}>
                                        <FormLabel>First Name</FormLabel>
                                        <Input
                                            {...register('firstName', {
                                                minLength: {
                                                    message: `Minimum of ${minNameLength} characters required`,
                                                    value: minNameLength,
                                                },
                                                required: 'Please enter a valid first name',
                                            })}
                                            placeholder={user.firstName || 'First name'}
                                            type="text"
                                        />
                                        <FormErrorMessage>
                                            {errors.firstName && errors.firstName.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                </Box>
                                <Box paddingLeft="1rem" style={{ width: '100%' }}>
                                    <FormControl isInvalid={Boolean(errors.lastName)}>
                                        <FormLabel>Last Name</FormLabel>
                                        <Input
                                            {...register('lastName', {
                                                minLength: {
                                                    message: `Minimum of ${minNameLength} characters required`,
                                                    value: minNameLength,
                                                },
                                                required: 'Please enter a valid last name',
                                            })}
                                            placeholder={user.lastName || 'Last name'}
                                            type="text"
                                        />
                                        <FormErrorMessage>
                                            {errors.lastName && errors.lastName.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                </Box>
                            </Flex>
                            <div>
                                <FormLabel>Display Name</FormLabel>
                                <Input {...register('displayName')} disabled type="text" value={user.displayName} />
                            </div>
                            <div>
                                <FormLabel>Email Address</FormLabel>
                                <Input {...register('email')} disabled type="text" value={user.email} />
                            </div>
                            <Center>
                                <HStack mt="1rem" spacing="2rem">
                                    <Button colorScheme="gray" onClick={resetForm} size="sm">
                                        Cancel
                                    </Button>
                                    <Button
                                        colorScheme="teal"
                                        isLoading={loading}
                                        loadingText="Updating.."
                                        size="sm"
                                        type="submit"
                                    >
                                        Save
                                    </Button>
                                </HStack>
                            </Center>
                            <Box borderBottomWidth="2px" pt="0.7rem">
                                <Text as="b" fontSize="xl">
                                    Profile Picture
                                </Text>
                            </Box>
                            <HStack paddingBottom={'1rem'} position="relative" spacing="2rem">
                                <SkeletonCircle fadeDuration={2} isLoaded={store.isAvatarLoaded} size="5rem">
                                    <Avatar size="xl" src={user.profilePictureURL} />
                                </SkeletonCircle>
                                <Link color="teal.500" cursor="pointer" fontSize="lg" href="#">
                                    Change Profile Picture <br /> <small>(PNG/JPG/JPEG only)</small>
                                </Link>
                                <Input
                                    accept="image/png, image/jpg, image/jpeg"
                                    aria-hidden="true"
                                    cursor="pointer"
                                    onChange={handleProfileUpload}
                                    opacity="0"
                                    placeholder="test"
                                    position="absolute"
                                    type="file"
                                />
                            </HStack>
                            <Box borderBottomWidth="2px" pt="0.7rem">
                                <Text as="b" fontSize="xl">
                                    Delete Profile
                                </Text>
                            </Box>
                            <Center padding=".5rem">
                                <HStack position="relative" spacing="2rem">
                                    <Button
                                        colorScheme="red"
                                        loadingText="Deleting.."
                                        onClick={onOpen}
                                        size="sm"
                                        type="button"
                                    >
                                        Delete Profile
                                    </Button>
                                    <AlertDialog
                                        isCentered
                                        isOpen={isOpen}
                                        leastDestructiveRef={cancelRef}
                                        motionPreset="slideInBottom"
                                        onClose={onClose}
                                    >
                                        <AlertDialogOverlay />

                                        <AlertDialogContent>
                                            <AlertDialogHeader>Discard Changes?</AlertDialogHeader>
                                            <AlertDialogCloseButton />
                                            <AlertDialogBody>
                                                Are you sure you want to delete your account?
                                            </AlertDialogBody>
                                            <AlertDialogFooter>
                                                <Button onClick={onClose} ref={cancelRef}>
                                                    Cancel
                                                </Button>
                                                <Button colorScheme="red" ml={3} onClick={deleteUserHandler}>
                                                    Yes
                                                </Button>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </HStack>
                            </Center>
                        </VStack>
                    </Box>
                </form>
            </Flex>
        </>
    )
}
