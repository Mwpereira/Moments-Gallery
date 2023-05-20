import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    AspectRatio,
    Badge,
    Box,
    Button,
    Drawer,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    Editable,
    EditableInput,
    EditablePreview,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    IconButton,
    Image,
    Input,
    Link,
    Menu,
    MenuButton,
    MenuItem,
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
    Skeleton,
    Table,
    TableContainer,
    Tag,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorMode,
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { BsThreeDotsVertical } from 'react-icons/bs'
// eslint-disable-next-line
import { ChevronDownIcon, DeleteIcon, DownloadIcon, EditIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'
import { updateImageInfo } from '../services/api/image-service'
import useStore from '../store/store'
import {
    DeleteImageDialogProps,
    DrawerImageInfoProps,
    EditImageInfoDialogProps,
    PhotoCardProps,
} from '../utils/ComponentPropTypes'
import { successResponse } from '../utils/ResponseUtils'
export const PhotoCard = (props: PhotoCardProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <Skeleton fadeDuration={2} isLoaded={props.isLoaded}>
                <Flex direction={'column'} justifyContent="center" maxW="20rem" width="full">
                    <AspectRatio maxW="20rem" ratio={16 / 9}>
                        <Image
                            _hover={{ cursor: 'pointer' }}
                            alt={`Picture of ${props.title}`}
                            objectFit={'cover'}
                            onClick={onOpen}
                            rounded="lg"
                            src={props.imageURL}
                            transition=".2s"
                        />
                    </AspectRatio>
                    <Flex align={'center'} justifyContent="space-between">
                        <Box paddingLeft="1" paddingTop="2">
                            <Text as="b" fontSize="xl" noOfLines={1} textAlign="left">
                                {props.title}
                            </Text>
                            <Text fontSize="sm" textAlign="left">
                                {props.date}
                            </Text>
                        </Box>
                        <Menu>
                            <MenuButton aria-label="Options" as={IconButton} icon={<BsThreeDotsVertical />} />
                            <MenuList>
                                <Link
                                    download
                                    href={props.imageURL}
                                    style={{ color: 'inherit', textDecoration: 'none' }}
                                    target="_blank"
                                >
                                    <MenuItem icon={<DownloadIcon />}>Download</MenuItem>
                                </Link>
                                <EditImageInfoDialog
                                    caption={props.caption}
                                    id={props.id}
                                    location={props.location}
                                    tags={props.tags}
                                    title={props.title}
                                />
                                <DeleteImageDialog deleteImageCallback={props.deleteImageCallback} imageId={props.id} />
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>
                <DrawerImageInfo imageInfo={props} isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
            </Skeleton>
        </>
    )
}

const DeleteImageDialog = (props: DeleteImageDialogProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef() as React.MutableRefObject<HTMLInputElement>
    return (
        <>
            <MenuItem color="red" icon={<DeleteIcon />} onClick={onOpen}>
                Delete
            </MenuItem>

            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Image
                        </AlertDialogHeader>

                        <AlertDialogBody>Are you sure you would like to delete this image?</AlertDialogBody>

                        <AlertDialogFooter>
                            <Button
                                colorScheme="blue"
                                mr={3}
                                onClick={() => {
                                    onClose()
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                ml={3}
                                onClick={() => {
                                    props.deleteImageCallback(props.imageId)
                                    onClose()
                                }}
                                type="submit"
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

const DrawerImageInfo = (props: DrawerImageInfoProps) => {
    const { colorMode } = useColorMode()
    const convertStringToTag = (tagString: string) => {
        let tags: string[] = []
        if (tagString.length > 0) {
            tags = tagString.toString().split(',')
        }
        return tags
    }
    props.onOpen
    return (
        <Drawer isOpen={props.isOpen} onClose={props.onClose} placement="right" size="md">
            <DrawerOverlay />
            <DrawerContent overflowY="auto">
                <DrawerCloseButton />
                <Flex
                    align="center"
                    alignContent="center"
                    direction={'column'}
                    justifyContent="space-between"
                    marginBottom={['1rem', '1rem', '1rem', '1rem']}
                    paddingTop="5rem"
                    paddingX={'1.5rem'}
                    w="full"
                >
                    <Image
                        alt={props.imageInfo.title}
                        src={props.imageInfo.imageURL}
                        style={{
                            objectFit: 'contain',
                        }}
                    />
                    <Box paddingY={5}>
                        <Text as="b" fontSize="2xl" textAlign="left">
                            {props.imageInfo.title}
                        </Text>
                    </Box>
                    <TableContainer marginTop="1rem" rounded={'lg'} whiteSpace={'unset'} width="100%">
                        <Table background={colorMode === 'dark' ? 'gray.600' : 'gray.50'} variant="simple">
                            <Thead>
                                <Tr>
                                    <Th fontSize={'sm'}>Information</Th>
                                    <Th></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td>Title</Td>
                                    <Td>
                                        <Editable defaultValue={props.imageInfo.title}>
                                            <EditablePreview />
                                            <EditableInput />
                                        </Editable>
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Td>Caption</Td>
                                    <Td>
                                        <Editable defaultValue={props.imageInfo.caption}>
                                            <EditablePreview />
                                            <EditableInput />
                                        </Editable>
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Td>Location</Td>
                                    <Td>
                                        <Editable
                                            defaultValue={
                                                props.imageInfo.location.length <= 0
                                                    ? 'No location provided'
                                                    : props.imageInfo.location
                                            }
                                        >
                                            <EditablePreview />
                                            <EditableInput />
                                        </Editable>
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Td>Tags</Td>
                                    <Td>
                                        {props.imageInfo.tags.length > 0 ? (
                                            convertStringToTag(props.imageInfo.tags)?.map((tag, i) => {
                                                return (
                                                    <Tag colorScheme="blue" key={i} mr={1} my={1}>
                                                        {tag}
                                                    </Tag>
                                                )
                                            })
                                        ) : (
                                            <Tag>No tags added</Tag>
                                        )}
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Td>Size</Td>
                                    <Td>{props.imageInfo.size}</Td>
                                </Tr>
                                <Tr>
                                    <Td>Format</Td>
                                    <Td>
                                        <Badge>{props.imageInfo.format}</Badge>
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Td>Uploaded</Td>
                                    <Td>{props.imageInfo.date}</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Flex>
            </DrawerContent>
        </Drawer>
    )
}

export type UpdateImageFormDTO = {
    id: string
    title: string
    caption: string
    tags: string
    location: string
}

const EditImageInfoDialog = (props: EditImageInfoDialogProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<UpdateImageFormDTO>()
    const store = useStore()

    const [isFormLoading, setIsFormLoading] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const handleSubmitForm = async (data: UpdateImageFormDTO) => {
        setIsFormLoading(true)
        //Update data obj with id attribute
        data.id = props.id
        try {
            const updateImagePromise: any = await updateImageInfo(data)
            if (successResponse(updateImagePromise)) {
                //Update the local store if successful
                store.updateImageInfo(data)
                setIsFormLoading(false)
                onClose()
                toast({
                    duration: 5000,
                    isClosable: false,
                    status: 'success',
                    title: 'Image updated successfully!',
                })
            }
        } catch (error) {
            setIsFormLoading(false)
            toast({
                duration: 5000,
                isClosable: false,
                status: 'error',
                title: error + '',
            })
        }
    }

    const handleCollectionMenuChange = (tagsStringArray: any) => {
        setValue('tags', tagsStringArray)
    }
    return (
        <>
            <MenuItem icon={<EditIcon />} onClick={onOpen}>
                Edit Image Info
            </MenuItem>
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.300" />
                <ModalContent>
                    <ModalHeader>Edit Image Info</ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={handleSubmit(handleSubmitForm)}>
                        <ModalBody>
                            <FormControl isInvalid={Boolean(errors.title)} p={2}>
                                <FormLabel>
                                    Title <span style={{ color: 'red' }}>*</span>
                                </FormLabel>
                                <Input
                                    {...register('title', {
                                        required: 'Please enter a valid title',
                                        value: props.title,
                                    })}
                                    shadow={'md'}
                                    type="string"
                                />
                                <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={Boolean(errors.caption)} p={2}>
                                <FormLabel>
                                    Caption <span style={{ color: 'red' }}>*</span>
                                </FormLabel>
                                <Input
                                    {...register('caption', {
                                        required: 'Please enter a valid caption',
                                        value: props.caption,
                                    })}
                                    shadow={'md'}
                                    type="string"
                                />
                                <FormErrorMessage>{errors.caption && errors.caption.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={Boolean(errors.tags)} p={2}>
                                <FormLabel>
                                    Tags
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
                                                defaultValue={
                                                    props.tags?.length === 0 ? undefined : props.tags.split(',')
                                                }
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
                                    {...register('tags', { value: props.tags })}
                                    shadow={'md'}
                                    type="string"
                                />
                                <FormErrorMessage>{errors.tags && errors.tags.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={Boolean(errors.location)} p={2}>
                                <FormLabel>Location</FormLabel>
                                <Input
                                    {...register('location', { value: props.location })}
                                    shadow={'md'}
                                    type="string"
                                />
                                <FormErrorMessage>{errors.location && errors.location.message}</FormErrorMessage>
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                colorScheme="red"
                                mr={3}
                                onClick={() => {
                                    reset()
                                    onClose()
                                }}
                                type="reset"
                            >
                                Cancel
                            </Button>
                            <Button colorScheme="green" isLoading={isFormLoading} loadingText="Saving.." type="submit">
                                Save
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}
