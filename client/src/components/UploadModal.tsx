import {
    Button,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    Menu,
    MenuButton,
    MenuItemOption,
    MenuList,
    MenuOptionGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast,
} from '@chakra-ui/react'

import { ChevronDownIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import '../assets/DnD.scss'
import { uploadImage, uploadImageToS3 } from '../services/api/image-service'
import { UploadModalProps } from '../utils/ComponentPropTypes'
import { successResponse } from '../utils/ResponseUtils'
import DragAndDrop from './DragAndDrop'

export interface UploadFormDTO {
    title: string
    format: any
    size: string
    caption: string
    tags: string
    location: string
}

let formData = {
    caption: '',
    format: '',
    location: '',
    size: '',
    tags: '',
    title: '',
}

let imageBytes: any

export const UploadModal = ({ refreshImagesArray }: UploadModalProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const [inputTags, setInputTags] = useState('')

    const handleCollectionMenuChange = (e: any) => {
        let tagsString = ''
        e.map((tag: string) => {
            tagsString = tagsString + tag + ', '
        })
        //removes the last comma from string to avoid displaying empty tags
        tagsString = tagsString.slice(0, -2)
        setInputTags(tagsString)
    }
    // Handle form submit
    const handleSubmit = async (e: any) => {
        e.preventDefault()

        //@ts-ignore
        formData = {
            ...formData,
            caption: e.target.caption.value,
            location: e.target.location.value,
            tags: e.target.tags.value,
            title: e.target.title.value,
        }

        if (formData.format === '') {
            toast({
                duration: 5000,
                isClosable: false,
                status: 'error',
                title: 'Select an image to upload',
            })
        } else if (formData.title === '') {
            toast({
                duration: 5000,
                isClosable: false,
                status: 'error',
                title: 'Enter a title for the image',
            })
        } else if (formData.caption === '') {
            toast({
                duration: 5000,
                isClosable: false,
                status: 'error',
                title: 'Enter a caption for the image',
            })
        } else {
            await sendFormData(formData)
        }
    }

    // Handle image upload data
    const handleImageSubmit = (image: any, format: any, size: any) => {
        formData.format = format.split('/')[1]
        formData.size = size
        imageBytes = image
    }

    // Send form data to server
    const sendFormData = async (uploadFormDTO: UploadFormDTO) => {
        try {
            let response: any = await uploadImage(uploadFormDTO)
            if (successResponse(response)) {
                const presignedURL = response.data.data.presignedUrl

                const binary = atob(imageBytes.split(',')[1])
                const array = []
                for (let i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i))
                }

                response = await uploadImageToS3(
                    new Blob([new Uint8Array(array)], { type: 'image/' + uploadFormDTO.format }),
                    presignedURL,
                    uploadFormDTO.format,
                )

                if (successResponse(response)) {
                    toast({
                        duration: 5000,
                        isClosable: true,
                        status: 'success',
                        title: 'Image uploaded successfully!',
                    })

                    formData = {
                        caption: '',
                        format: '',
                        location: '',
                        size: '',
                        tags: '',
                        title: '',
                    }
                    onClose()
                    //This will call the getImages() in the parent component to refresh the view
                    refreshImagesArray()
                } else {
                    toast({
                        duration: 5000,
                        isClosable: true,
                        status: 'error',
                        title: 'Image failed to upload',
                    })
                }
            } else {
                toast({
                    duration: 5000,
                    isClosable: true,
                    status: 'error',
                    title: 'Image failed to upload',
                })
            }
        } catch (error: any) {
            toast({
                duration: 5000,
                isClosable: true,
                status: 'error',
                title: 'Image failed to upload',
            })
        }
    }

    return (
        <>
            <Button height="3.5rem" leftIcon={<AiOutlineCloudUpload />} minW="15rem" onClick={onOpen}>
                Upload Images
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} size="2xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Upload Image</ModalHeader>
                    <ModalCloseButton />

                    <form onSubmit={handleSubmit}>
                        <ModalBody>
                            <FormControl>
                                {/* @ts-ignore */}
                                <DragAndDrop imageSubmitCallback={handleImageSubmit} />
                            </FormControl>

                            <FormControl my={3}>
                                <FormLabel>
                                    Title <span style={{ color: 'red' }}>*</span>
                                </FormLabel>
                                <Input name="title" placeholder="Sunset" type="text"></Input>
                            </FormControl>

                            <FormControl my={3}>
                                <FormLabel>
                                    Caption <span style={{ color: 'red' }}>*</span>
                                </FormLabel>
                                <Input name="caption" placeholder="Fun evening with friends" type="text"></Input>
                            </FormControl>

                            <FormControl my={3}>
                                <FormLabel>
                                    Collection
                                    <Menu>
                                        <MenuButton
                                            as={IconButton}
                                            colorScheme="gray"
                                            icon={<ChevronDownIcon />}
                                            isActive={isOpen}
                                            mx={2}
                                            size="xs"
                                            variant="solid"
                                        ></MenuButton>
                                        <MenuList>
                                            <MenuOptionGroup
                                                onChange={(value) => handleCollectionMenuChange(value)}
                                                title="Collections"
                                                type="checkbox"
                                            >
                                                <MenuItemOption value="Personal">Personal</MenuItemOption>
                                                <MenuItemOption value="Work">Work</MenuItemOption>
                                                <MenuItemOption value="Vacation">Vacation</MenuItemOption>
                                                <MenuItemOption value="Family">Family</MenuItemOption>
                                                <MenuItemOption value="Summer">Summer</MenuItemOption>
                                                <MenuItemOption value="School">School</MenuItemOption>
                                            </MenuOptionGroup>
                                        </MenuList>
                                    </Menu>
                                </FormLabel>
                                <Input
                                    disabled
                                    name="tags"
                                    placeholder="Personal, Work, Family, Friends..."
                                    type="text"
                                    value={inputTags}
                                ></Input>
                            </FormControl>

                            <FormControl my={3}>
                                <FormLabel>Location</FormLabel>
                                <Input name="location" placeholder="Blue Mountain" type="text"></Input>
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} type="submit">
                                Upload
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UploadModal
