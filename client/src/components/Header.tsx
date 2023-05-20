import { ChevronRightIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Box, Flex, IconButton, Text, useColorMode } from '@chakra-ui/react'
// eslint-disable-next-line
import { HeaderProps } from '../utils/ComponentPropTypes'

const Header = ({ showSidebarButton = true, onShowSidebar }: HeaderProps) => {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <>
            {showSidebarButton && (
                <Flex color="white" direction={'row'} justifyContent="space-between" p={4} shadow="md" zIndex={'10000'}>
                    <Box>
                        <IconButton
                            aria-label="button"
                            colorScheme={'gray'}
                            icon={<ChevronRightIcon color={colorMode === 'light' ? 'gray' : 'white'} h={8} w={8} />}
                            onClick={onShowSidebar}
                            variant="outline"
                        />
                    </Box>
                    <Box paddingTop=".5rem">
                        <Text color={colorMode === 'light' ? 'black' : 'white'} fontSize="xl">
                            Moments
                        </Text>
                    </Box>

                    <Box>
                        <IconButton
                            aria-label="Theme changer"
                            color={colorMode === 'light' ? 'gray' : 'white'}
                            colorScheme={'gray'}
                            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            onClick={toggleColorMode}
                        />
                    </Box>
                </Flex>
            )}
        </>
    )
}

export default Header
