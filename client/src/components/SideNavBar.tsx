import { ChevronDownIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import {
    Avatar,
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Heading,
    IconButton,
    Image,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    Tooltip,
    useColorMode,
    useToast,
    VStack,
} from '@chakra-ui/react'
// eslint-disable-next-line
import { MouseEventHandler } from 'react'
import { NavLink as ReactLink, useNavigate } from 'react-router-dom'

import logo from '../assets/images/logo_transparent.png'
import { UserStore } from '../interfaces/UserStore'
import { logout } from '../services/api/auth-service'
import useStore from '../store/store'
import { SideNavBarProps } from '../utils/ComponentPropTypes'

const SideNavBar = ({ isOpen, variant, onClose }: SideNavBarProps) => {
    return variant === 'sidebar' ? (
        <Box bg="blackAlpha.300" h="100%" left={0} p={5} shadow="lg" top={0} w="18rem">
            <SidebarContent onClick={onClose} />
        </Box>
    ) : (
        <Drawer isOpen={isOpen} onClose={onClose} placement="left">
            <DrawerOverlay>
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Moments</DrawerHeader>
                    <DrawerBody>
                        <SidebarContent onClick={onClose} />
                    </DrawerBody>
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
    )
}

const SidebarContent = ({ onClick }: { onClick: MouseEventHandler }) => {
    const { colorMode, toggleColorMode } = useColorMode()
    const store: UserStore = useStore()
    const user = store.user
    const navigate = useNavigate()
    const toast = useToast()
    const onLogoutClick = async () => {
        try {
            await logout()
            store.removeUser()
            toast({
                duration: 5000,
                isClosable: true,
                status: 'success',
                title: 'Signed out',
            })
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Flex align="center" flexDir="column" h="100%" justifyContent="space-between" left="0" transition={'.2s'}>
            <Image alt={'Login Image'} src={logo} w={['60%', '70%', '60%', '90%']} />

            <Flex as="nav" flexDir="column" w="100%">
                <VStack align="center" as={'nav'} spacing={[4, 5, 4, 7]} width={'100%'}>
                    <IconButton
                        aria-label="Theme changer"
                        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                        onClick={toggleColorMode}
                    />
                    <Button
                        _activeLink={{ background: 'blackAlpha.500', color: 'whiteAlpha.800' }}
                        as={ReactLink}
                        colorScheme={'gray'}
                        onClick={onClick}
                        size="md"
                        style={{ color: 'inherit', textDecoration: 'none' }}
                        to="/dashboard/home"
                        w="100%"
                    >
                        Home
                    </Button>
                    <Button
                        _activeLink={{ background: 'blackAlpha.500', color: 'whiteAlpha.800' }}
                        as={ReactLink}
                        colorScheme={'gray'}
                        onClick={onClick}
                        size="md"
                        style={{ color: 'inherit', textDecoration: 'none' }}
                        to="/dashboard/profile"
                        w="100%"
                    >
                        Profile
                    </Button>
                    <Button
                        _activeLink={{ background: 'blackAlpha.500', color: 'whiteAlpha.800' }}
                        as={ReactLink}
                        colorScheme={'gray'}
                        onClick={onClick}
                        size="md"
                        style={{ color: 'inherit', textDecoration: 'none' }}
                        to="/dashboard/explore"
                        w="100%"
                    >
                        Explore
                    </Button>
                </VStack>
            </Flex>

            <Flex flexDir="column" mb={2} w="100%">
                <Menu>
                    <Tooltip aria-label="A tooltip" label={user.email}>
                        <MenuButton
                            as={Button}
                            paddingBottom={'3rem'}
                            paddingTop="2rem"
                            rightIcon={<ChevronDownIcon />}
                        >
                            <Flex align="center" alignContent="center" justifyContent={'center'} mt={4}>
                                <Avatar size="md" src={user.profilePictureURL} />
                                <Flex display={'flex'} flexDir="column" maxW={'70%'} ml="2">
                                    <Heading as="h3" noOfLines={1} size="sm">
                                        {user.displayName || 'No user found'}
                                    </Heading>
                                    <Text color="gray" noOfLines={1}>
                                        {user.email || 'No user found'}
                                    </Text>
                                </Flex>
                            </Flex>
                        </MenuButton>
                    </Tooltip>
                    <MenuList>
                        <MenuItem onClick={onLogoutClick}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
        </Flex>
    )
}

export default SideNavBar
