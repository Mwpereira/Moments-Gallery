import { SearchIcon } from '@chakra-ui/icons'
import {
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Input,
    InputGroup,
    InputLeftElement,
    SimpleGrid,
    Spacer,
    Text,
} from '@chakra-ui/react'
import { AiOutlineRollback } from 'react-icons/ai'
import { Collection } from '../components/Collection'

// eslint-disable-next-line no-unused-vars
import { useEffect, useState } from 'react'
import { PhotoCard } from '../components/PhotoCard'
import { Image } from '../interfaces/Image'
import { UserStore } from '../interfaces/UserStore'
import useStore from '../store/store'
type TagStructure = {
    count: number
    imageData: Image[]
    name: string
}

type ImageDto = {
    id: string
    title: string
    format: string
    size: number
    caption: string
    tags: string
    url: string
    location: string
    lastModifiedDateTime: string
    uploadedDateTime: string
}

export const Explore = () => {
    const store: UserStore = useStore()
    const user = store.user
    const images = user.images
    const deleteImage = (imageId: string): void => {
        store.deleteImage(imageId)
    }

    const [tags, setTags] = useState<TagStructure[]>([])
    const [displayTags, setDisplayTags] = useState<TagStructure[]>([])
    const [displayCollection, setDisplayCollection] = useState<ImageDto[]>([])
    const [showCollection, setShowCollection] = useState(0)
    const [collectionName, setCollectionName] = useState('')

    const onSearchBarChange = (searchQuery: string): void => {
        let newTagsList: TagStructure[] = []
        if (searchQuery.length <= 0) {
            newTagsList = tags
        } else {
            tags.map((item) => {
                if (item.name.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())) {
                    newTagsList.push(item)
                }
            })
        }
        setDisplayTags(newTagsList)
    }

    const onClickBackToCollection = () => {
        setShowCollection(0)
    }

    const gatherTags = () => {
        if (images.length > 0) {
            let gatheredTags: TagStructure[] = []
            let notagFlag = 0
            let notagPosition = 0
            images.map((img) => {
                if (img.tags.toString().length === 0) {
                    if (notagFlag === 0) {
                        notagFlag++
                        gatheredTags.push({
                            count: 1,
                            imageData: [img],
                            name: 'Other',
                        })
                        notagPosition = gatheredTags.length
                    } else {
                        gatheredTags[notagPosition].count++
                        gatheredTags[notagPosition].imageData.push(img)
                    }
                } else {
                    img.tags
                        .toString()
                        .split(',')
                        .map((tag: string) => {
                            let positionIndex = -1
                            gatheredTags.forEach((item, index) => {
                                if (item.name === tag) {
                                    positionIndex = index
                                    return
                                }
                            })

                            if (positionIndex === -1) {
                                gatheredTags.push({
                                    count: 1,
                                    imageData: [img],
                                    name: tag,
                                })
                            } else {
                                gatheredTags[positionIndex].count++
                                gatheredTags[positionIndex].imageData.push(img)
                            }
                        })
                }
            })
            setDisplayTags(gatheredTags)
            setTags(gatheredTags)
        }
    }

    useEffect(() => {
        gatherTags()
    }, [])

    return (
        <Flex align={['center', 'center', 'normal', 'normal']} direction="column" p={['1rem', '2rem', '2rem', '2rem']}>
            <Flex align={['center', '', '', '']} minWidth="100%" zIndex={1000}>
                <Box w="100%">
                    <Heading
                        as="h2"
                        noOfLines={2}
                        paddingBottom={['.5rem', '2rem', '2.5rem']}
                        size={['xl', 'xl', '2xl', '3xl']}
                        textAlign={['center', 'center', 'left', 'left']}
                    >
                        Explore
                    </Heading>
                    <Flex
                        alignItems="center"
                        direction={['column', 'column', 'row', 'row']}
                        justifyContent={'space-between'}
                    >
                        <Heading
                            as="h2"
                            fontWeight="normal"
                            noOfLines={1}
                            size={['sm', 'md', 'lg', 'xl']}
                            textAlign="left"
                        >
                            Collections
                            {showCollection === 0 ? null : (
                                <>
                                    : <span style={{ fontWeight: '500' }}>{collectionName}</span>{' '}
                                </>
                            )}
                        </Heading>
                        <Spacer />
                        <InputGroup maxWidth={['100%', '100%', '16rem', '16rem']}>
                            <InputLeftElement pointerEvents="none">
                                <SearchIcon />
                            </InputLeftElement>
                            <Input
                                onChange={(e) => onSearchBarChange(e.target.value)}
                                placeholder="Search"
                                type="text"
                            />
                        </InputGroup>
                    </Flex>
                </Box>
            </Flex>
            {showCollection === 0 ? (
                <SimpleGrid
                    maxH={['67vh', '66vh', '75vh', '75vh']}
                    minChildWidth={['13rem', '13rem', '13rem', '15rem']}
                    overflowY="auto"
                    p={['1rem', '2rem', '4rem', '3rem']}
                    spacing="2rem"
                >
                    {displayTags.length > 0 ? (
                        displayTags.map((tag, index) => (
                            <Collection
                                collectionName={tag.name}
                                count={tag.count}
                                displayCollection={displayCollection}
                                images={tag.imageData}
                                key={index}
                                setCollectionName={setCollectionName}
                                setDisplayCollection={setDisplayCollection}
                                setShowCollection={setShowCollection}
                                thumbnail={tag.imageData[0].url}
                            />
                        ))
                    ) : (
                        <>
                            {' '}
                            {tags.length > 0 ? (
                                <Center>
                                    <Text> No collections was found.</Text>
                                </Center>
                            ) : (
                                <Center>
                                    <Text> No collections created. Add tags to uploaded images to get started.</Text>
                                </Center>
                            )}
                        </>
                    )}
                </SimpleGrid>
            ) : (
                <Flex
                    align={['center', 'normal', 'normal', 'normal']}
                    direction="column"
                    maxH={'100vh'}
                    p={['1rem', '2rem', '4rem', '3rem']}
                    width="100%"
                >
                    <SimpleGrid
                        maxH={['67vh', '66vh', '77vh', '77vh']}
                        minChildWidth={['13rem', '13rem', '14rem', '15rem']}
                        overflowY="auto"
                        spacing="2rem"
                    >
                        {displayCollection.map((image) => {
                            return (
                                <PhotoCard
                                    caption={image.caption}
                                    date={'Nov 9, 2022'}
                                    deleteImageCallback={deleteImage}
                                    format={image.format}
                                    id={image.id}
                                    imageURL={image.url}
                                    isLoaded={true}
                                    key={image.id}
                                    location={image.location}
                                    size={String(image.size)}
                                    tags={image.tags}
                                    title={image.title}
                                />
                            )
                        })}
                    </SimpleGrid>

                    <Button
                        height="3.5rem"
                        leftIcon={<AiOutlineRollback />}
                        maxW="16rem"
                        minW="15rem"
                        onClick={onClickBackToCollection}
                        style={{ marginTop: '50px' }}
                    >
                        Back To Folder
                    </Button>
                </Flex>
            )}
        </Flex>
    )
}
