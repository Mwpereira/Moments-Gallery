import { ArrowForwardIcon, CheckCircleIcon } from '@chakra-ui/icons'
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogOverlay,
    Button,
    Center,
    Icon,
    Text,
    useDisclosure,
    VStack,
} from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export const SuccessAlert = (props: any) => {
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef() as React.MutableRefObject<HTMLInputElement>
    onOpen()
    return (
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
                <Center bg="#6FCF97" borderTopRadius={'md'} color="white" h="12rem" w="100%">
                    <Icon as={CheckCircleIcon} h={24} w={24} />
                </Center>
                <AlertDialogBody>
                    <VStack spacing={4}>
                        <Center>
                            <Text as="b" fontSize="4xl">
                                {' '}
                                {props.type === 'success' ? 'Great!' : 'Sorry!'}{' '}
                            </Text>
                        </Center>
                        <Center>
                            <Text fontSize="lg">
                                {props.type === 'success'
                                    ? 'Your account has been created successfully.'
                                    : 'Sorry something went wrong.'}{' '}
                            </Text>
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
    )
}
