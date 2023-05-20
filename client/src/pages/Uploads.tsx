import { ChevronDownIcon, Search2Icon } from '@chakra-ui/icons'
import {
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Input,
    InputGroup,
    InputLeftElement,
    Menu,
    MenuButton,
    MenuItemOption,
    MenuList,
    MenuOptionGroup,
    SimpleGrid,
    Spacer,
    Spinner,
    Text,
    useToast,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { PhotoCard } from '../components/PhotoCard'

import UploadModal from '../components/UploadModal'
import { Image } from '../interfaces/Image'
import { UserStore } from '../interfaces/UserStore'
import { deleteImage, getAllImages } from '../services/api/image-service'
import useStore from '../store/store'
import { successResponse } from '../utils/ResponseUtils'

export type DeleteImageDTO = {
    id: string
}

const Uploads = () => {
    const store: UserStore = useStore()
    const user = store.user
    const images = user.images
    const [displayImages, setDisplayImages] = useState<Image[]>([])
    const [imagesLoadingFlag, setImagesLoadingFlag] = useState(Boolean)
    const toast = useToast()

    const getImages = async () => {
        setImagesLoadingFlag(false)
        try {
            const getImagesResponse: any = await getAllImages()
            if (successResponse(getImagesResponse)) {
                const imagesRawObj = getImagesResponse.data.data.images
                const imagesRawList = Object.values(imagesRawObj)
                let imagesList: Image[] = imagesRawList.map((imgData: any) => {
                    return castRawToImage(imgData)
                })
                //update the local state (which will be used for local operations like search/sort)
                //By default it will be sorted by latest image first
                setDisplayImages([...imagesList].sort(sortByDateDescending))
                //update the store which is main source of truth
                //By default it will be sorted by latest image first
                store.updateImagesList([...imagesList].sort(sortByDateDescending))
                //fake loading effect
                setTimeout(() => setImagesLoadingFlag(true), 200)
            }
        } catch (error) {
            setImagesLoadingFlag(true)
            console.log(error)
        }
    }

    useEffect(() => {
        //Fetch new images and update the local store as well as component state images
        getImages()
    }, [])

    const onSearchBarChange = (searchQuery: string): void => {
        let newImageList: Image[] = []
        if (searchQuery.length <= 0) {
            newImageList = images
        } else {
            images.map((image) => {
                if (
                    image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    image.format.toLowerCase().includes(searchQuery.toLowerCase())
                ) {
                    newImageList.push(image)
                }
            })
        }
        setDisplayImages(newImageList)
    }

    //Callback coming from image component to delete an image
    const deleteImageHandler = async (imageId: string) => {
        try {
            const deleteImageObj: DeleteImageDTO = { id: imageId }
            console.log(deleteImageObj)
            const deleteImagePromise = await deleteImage(deleteImageObj)
            if (successResponse(deleteImagePromise)) {
                let images = [...displayImages]
                images = images.filter((imageObj: Image) => imageObj.id != imageId)
                //Update local state for images
                setDisplayImages([...images])
                //Update store for latest images list
                store.deleteImage(imageId)
                toast({
                    duration: 5000,
                    isClosable: true,
                    status: 'success',
                    title: 'Image deleted successfully!',
                })
            } else {
                toast({
                    duration: 5000,
                    isClosable: true,
                    status: 'error',
                    title: 'Something went wrong',
                })
            }
        } catch (error) {
            toast({
                duration: 5000,
                isClosable: true,
                status: 'error',
                title: error + '',
            })
        }
    }

    //Helper function to sort images by name A -> Z
    const sortByNameAtoZ = (a: Image, b: Image) => {
        const name1 = a.title.toUpperCase()
        const name2 = b.title.toUpperCase()

        let comparison = 0

        if (name1 > name2) {
            comparison = 1
        } else if (name1 < name2) {
            comparison = -1
        }
        return comparison
    }

    //Helper function to sort images by name Z -> A
    const sortByNameZtoA = (a: Image, b: Image) => {
        const name1 = a.title.toUpperCase()
        const name2 = b.title.toUpperCase()

        let comparison = 0

        if (name1 < name2) {
            comparison = 1
        } else if (name1 > name2) {
            comparison = -1
        }
        return comparison
    }

    // Helper function to sort images by size
    const sortBySizeAscending = (a: Image, b: Image) => {
        const size1 = a.size
        const size2 = b.size
        let comparison = 0

        if (size1 < size2) {
            comparison = 1
        } else if (size1 > size2) {
            comparison = -1
        }
        return comparison
    }
    // Helper function to sort images by size
    const sortBySizeDescending = (a: Image, b: Image) => {
        const size1 = a.size
        const size2 = b.size
        let comparison = 0

        if (size1 > size2) {
            comparison = 1
        } else if (size1 < size2) {
            comparison = -1
        }
        return comparison
    }

    // Helper function to sort images by upload date
    const sortByDateAscending = (a: Image, b: Image) => {
        const size1 = a.uploadedDateTime
        const size2 = b.uploadedDateTime
        let comparison = 0

        if (size1 > size2) {
            comparison = 1
        } else if (size1 < size2) {
            comparison = -1
        }
        return comparison
    }
    // Helper function to sort images by upload date
    const sortByDateDescending = (a: Image, b: Image) => {
        const size1 = a.uploadedDateTime
        const size2 = b.uploadedDateTime
        let comparison = 0

        if (size1 < size2) {
            comparison = 1
        } else if (size1 > size2) {
            comparison = -1
        }
        return comparison
    }

    const onSortMenuClick = (e: any): void => {
        switch (e) {
            case 'A-Z':
                setDisplayImages([...displayImages].sort(sortByNameAtoZ))
                break
            case 'Z-A':
                setDisplayImages([...displayImages].sort(sortByNameZtoA))
                break
            case 'File Size desc':
                setDisplayImages([...displayImages].sort(sortBySizeDescending))
                break
            case 'File Size asc':
                setDisplayImages([...displayImages].sort(sortBySizeAscending))
                break
            case 'Upload date asc':
                setDisplayImages([...displayImages].sort(sortByDateAscending))
                break
            case 'Upload date desc':
                setDisplayImages([...displayImages].sort(sortByDateDescending))
                break
            default:
                break
        }
    }

    //Helper functions for image information

    //Converts a number to formatted bytes
    const formatBytes = (bytes: number, decimals = 2): string => {
        if (!+bytes) return '0 Bytes'

        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    //Returns a formatted date from Epoch seconds
    const convertEpochToDate = (epochStamp: number): string => {
        const d = new Date(0)
        d.setUTCSeconds(epochStamp)
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    }

    const castRawToImage = (obj: any): Image => {
        const image = {} as Image
        image['id'] = obj.data._id
        image['title'] = obj.data.title
        image['format'] = obj.data.format
        image['size'] = parseInt(obj.data.size)
        image['caption'] = obj.data.caption
        image['tags'] = obj.data.tags
        image['url'] = obj.presignedUrl
        image['location'] = obj.data.location
        image['lastModifiedDateTime'] = obj.data.lastModifiedDateTime
        image['uploadedDateTime'] = obj.data.uploadedDateTime
        return image
    }

    return (
        <Flex
            align={['center', 'normal', 'normal', 'normal']}
            direction="column"
            maxH={'100vh'}
            p={['1rem', '2rem', '2rem', '2rem']}
            width="100%"
        >
            <Flex align={['center', 'center', '', '']}>
                <Box w="100%">
                    <Heading
                        as="h2"
                        noOfLines={2}
                        paddingBottom={['1rem', '2rem', '3rem']}
                        size={['xl', 'xl', '2xl', '3xl']}
                        textAlign={['center', 'center', 'left', 'left']}
                    >
                        Uploaded Images
                    </Heading>
                    <Flex direction={['column-reverse', 'column-reverse', 'row', 'row']} justifyContent="space-between">
                        <Menu>
                            <MenuButton
                                as={Button}
                                disabled={images.length <= 0 ? true : false}
                                rightIcon={<ChevronDownIcon />}
                                width={['100%', '100%', '16rem', '16rem']}
                            >
                                Filters
                            </MenuButton>
                            <br />
                            <MenuList>
                                <MenuOptionGroup
                                    defaultValue="Upload date desc"
                                    onChange={(value) => onSortMenuClick(value)}
                                    title="Order"
                                    type="radio"
                                >
                                    <MenuItemOption value="A-Z">A-Z</MenuItemOption>
                                    <MenuItemOption value="Z-A">Z-A</MenuItemOption>
                                    <MenuItemOption value="Upload date desc">Upload date ↑</MenuItemOption>
                                    <MenuItemOption value="Upload date asc">Upload date ↓</MenuItemOption>
                                    <MenuItemOption value="File Size asc">File Size ↑</MenuItemOption>
                                    <MenuItemOption value="File Size desc">File Size ↓</MenuItemOption>
                                </MenuOptionGroup>
                            </MenuList>
                        </Menu>
                        <Spacer />
                        <Flex maxWidth={['100%', '100%', '16rem', '16rem']}>
                            <InputGroup>
                                <InputLeftElement pointerEvents={'none'}>
                                    <Search2Icon />
                                </InputLeftElement>
                                <Input
                                    disabled={images.length <= 0 ? true : false}
                                    onChange={(e) => onSearchBarChange(e.target.value)}
                                    placeholder={'Search'}
                                    type={'search'}
                                />
                            </InputGroup>
                        </Flex>
                    </Flex>
                </Box>
            </Flex>
            {!imagesLoadingFlag ? (
                <Center height="10rem">
                    <Spinner color="blue.500" size="xl" />
                </Center>
            ) : (
                <SimpleGrid
                    marginTop={'1rem'}
                    maxH={['67vh', '66vh', '77vh', '77vh']}
                    minChildWidth={['18rem', '15rem', '13rem', '15rem']}
                    overflowY="auto"
                    spacing="2rem"
                >
                    {images.length > 0 ? (
                        displayImages.length > 0 ? (
                            displayImages.map((image) => {
                                return (
                                    <PhotoCard
                                        caption={image.caption}
                                        date={convertEpochToDate(parseInt(image.uploadedDateTime))}
                                        deleteImageCallback={deleteImageHandler}
                                        format={image.format}
                                        id={image.id}
                                        imageURL={image.url}
                                        isLoaded={imagesLoadingFlag}
                                        key={image.id}
                                        location={image.location}
                                        size={formatBytes(image.size)}
                                        tags={image.tags}
                                        title={image.title}
                                    />
                                )
                            })
                        ) : (
                            <Center>
                                <Text as="h1" noOfLines={2} paddingBottom="3rem" size="lg">
                                    No images matched your search!
                                </Text>
                            </Center>
                        )
                    ) : (
                        <Center>
                            <Text as="h1" noOfLines={2} paddingBottom="3rem" size="lg">
                                No images found. Please upload images!
                            </Text>
                        </Center>
                    )}
                </SimpleGrid>
            )}
            <Flex float={'right'} height="100%" justifyContent="space-between" paddingTop="2.75rem">
                <Spacer />
                <UploadModal refreshImagesArray={getImages} />
            </Flex>
        </Flex>
    )
}

export default Uploads
