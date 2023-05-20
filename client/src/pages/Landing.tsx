import { Button, Flex, Heading, Image, Show, Stack, Text, useBreakpointValue } from '@chakra-ui/react'

import { Link as ReactLink } from 'react-router-dom'
import logo from '../assets/images/logo_transparent.png'

export default function Landing() {
    return (
        <Stack direction={{ base: 'column', md: 'row' }} height={'100vh'}>
            <Image alt={'Login Image'} boxSize="200px" objectFit={'cover'} position="absolute" src={logo} />
            <Flex align={'center'} flex={1} justify={'center'} p={8}>
                <Stack maxW={'lg'} spacing={6} w={'full'}>
                    <Heading fontSize={{ base: '3xl', lg: '5xl', md: '4xl' }}>
                        <Text
                            _after={{
                                bg: 'red.400',
                                bottom: 1,
                                content: "''",
                                height: useBreakpointValue({ base: '20%', md: '30%' }),
                                left: 0,
                                position: 'absolute',
                                width: 'full',
                                zIndex: -1,
                            }}
                            as={'span'}
                            position={'relative'}
                        >
                            Moments
                        </Text>
                        <br />
                        <Text as={'span'} color={'red.400'}>
                            Enjoy every moment.
                        </Text>
                    </Heading>
                    <Text color={'gray.500'} fontSize={{ base: 'md', lg: 'lg' }}>
                        A place for you to easily save and share what matters to you. Access your memories across all
                        your devices.
                    </Text>
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                        <Button
                            _hover={{
                                bg: 'red.500',
                            }}
                            as={ReactLink}
                            bg={'red.400'}
                            color={'white'}
                            rounded={'full'}
                            style={{ color: 'inherit', textDecoration: 'none' }}
                            to="/login"
                        >
                            Login
                        </Button>
                        <Button
                            as={ReactLink}
                            rounded={'full'}
                            style={{ color: 'inherit', textDecoration: 'none' }}
                            to="/register"
                            variant="ghost"
                        >
                            Create An Account
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
            <Show breakpoint="(min-width: 700px)">
                <Flex flex={1}>
                    <Image
                        alt={'Login Image'}
                        objectFit={'cover'}
                        src={
                            'https://images.unsplash.com/photo-1507992781348-310259076fe0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
                        }
                    />
                </Flex>
            </Show>
        </Stack>
    )
}
