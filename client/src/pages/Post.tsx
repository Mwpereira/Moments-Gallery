import {
    Avatar,
    Box,
    Button,
    Flex,
    HStack,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    // ModalOverlay,
    ModalContent,
    Spacer,
    Stack,
    Stat,
    StatLabel,
    Tag,
    Text,
    useColorMode,
    useDisclosure,
    VStack,
} from '@chakra-ui/react'

import { CalendarIcon, ChatIcon, InfoIcon, SunIcon } from '@chakra-ui/icons'

export default function Post() {
    const { colorMode } = useColorMode()

    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <Button onClick={onOpen}>Open Modal</Button>

            <Modal isOpen={isOpen} onClose={onClose} size="full">
                <ModalContent>
                    {/* <ModalHeader>Beach Image</ModalHeader> */}
                    <ModalCloseButton color={'gray.100'} size={'xl'} />
                    <ModalBody>
                        <Stack direction="row" spacing={-8}>
                            <Box p={5} w="70%">
                                <Image borderRadius={'lg'} maxHeight="90vh" minHeight="90vh" src={''} />
                            </Box>

                            <Box p={5} w="30%">
                                <Flex
                                    bg="white"
                                    borderRadius={'lg'}
                                    maxHeight="90vh"
                                    minHeight="90vh"
                                    overflowY="scroll"
                                    textColor="black"
                                >
                                    <VStack
                                        alignItems={'flex-start'}
                                        bg="white"
                                        marginLeft="25"
                                        marginTop="5"
                                        spacing={5}
                                    >
                                        <Avatar size={'lg'} src="https://bit.ly/broken-link" />
                                        <Stat>
                                            <StatLabel
                                                color={colorMode === 'light' ? 'white' : 'black'}
                                                fontSize={'lg'}
                                            >
                                                @jameskibi12
                                            </StatLabel>
                                        </Stat>
                                        <HStack padding={'-5'}>
                                            <CalendarIcon color={colorMode === 'light' ? 'white' : 'black'} />
                                            <Text
                                                as={'b'}
                                                color={colorMode === 'light' ? 'white' : 'black'}
                                                textAlign={'start'}
                                            >
                                                Date and Time Taken
                                            </Text>
                                        </HStack>
                                        <Text color={colorMode === 'light' ? 'white' : 'black'}>
                                            11:34 AM; Tuesday, May 4th, 2019
                                        </Text>
                                        <HStack>
                                            <ChatIcon color={colorMode === 'light' ? 'white' : 'black'} />
                                            <Text as={'b'} color={colorMode === 'light' ? 'white' : 'black'}>
                                                Caption
                                            </Text>
                                        </HStack>
                                        <Text color={colorMode === 'light' ? 'white' : 'black'}>
                                            This is a beach I visited a few years ago!
                                        </Text>
                                        <HStack>
                                            <InfoIcon color={colorMode === 'light' ? 'white' : 'black'} />
                                            <Text as={'b'} color={colorMode === 'light' ? 'white' : 'black'}>
                                                Picture Info
                                            </Text>
                                        </HStack>

                                        <Text color={colorMode === 'light' ? 'white' : 'black'}>
                                            Size: 30.69 MB Posted: May 9th, 2019
                                        </Text>
                                        <HStack>
                                            <SunIcon color={colorMode === 'light' ? 'white' : 'black'} />
                                            <Text as={'b'} color={colorMode === 'light' ? 'white' : 'black'}>
                                                Tags
                                            </Text>
                                        </HStack>
                                        <Text as={'u'} color={colorMode === 'light' ? 'white' : 'black'}>
                                            Theme
                                        </Text>
                                        <HStack spacing={2}>
                                            <Tag colorScheme={'teal'} key={'sm'} size={'sm'} variant={'solid'}>
                                                Beach
                                            </Tag>
                                            <Tag colorScheme={'teal'} key={'sm'} size={'sm'} variant={'solid'}>
                                                Clouds
                                            </Tag>
                                            <Tag colorScheme={'teal'} key={'sm'} size={'sm'} variant={'solid'}>
                                                Nature
                                            </Tag>
                                            <Tag colorScheme={'teal'} key={'sm'} size={'sm'} variant={'solid'}>
                                                Dark
                                            </Tag>
                                        </HStack>
                                        <HStack spacing={2}>
                                            <Tag colorScheme={'teal'} key={'sm'} size={'sm'} variant={'solid'}>
                                                Mountain
                                            </Tag>
                                            <Tag colorScheme={'teal'} key={'sm'} size={'sm'} variant={'solid'}>
                                                Natural
                                            </Tag>
                                            <Tag colorScheme={'teal'} key={'sm'} size={'sm'} variant={'solid'}>
                                                Waves
                                            </Tag>
                                        </HStack>

                                        <HStack spacing={2}>
                                            <Tag colorScheme={'orange'} key={'sm'} size={'sm'} variant={'solid'}>
                                                Scenery
                                            </Tag>
                                            <Tag colorScheme={'orange'} key={'sm'} size={'sm'} variant={'solid'}>
                                                Outdoors
                                            </Tag>
                                            <Tag colorScheme={'orange'} key={'sm'} size={'sm'} variant={'solid'}>
                                                Landscape
                                            </Tag>
                                        </HStack>

                                        <Spacer />
                                    </VStack>
                                </Flex>
                            </Box>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}
