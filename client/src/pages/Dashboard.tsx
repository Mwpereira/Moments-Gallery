import { Box, Flex, useBreakpointValue } from '@chakra-ui/react'

import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import Header from '../components/Header'
import SideNavBar from '../components/SideNavBar'

const smVariant = { navigation: 'drawer', navigationButton: true }
const mdVariant = { navigation: 'sidebar', navigationButton: false }
// eslint-disable-next-line

const Dashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true)
    const variants = useBreakpointValue({ base: smVariant, md: mdVariant })

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen)
    return (
        <>
            <Flex direction={['column', 'column', 'row', 'row']}>
                <Box height={['72px', '72px', '100vh']}>
                    <SideNavBar isOpen={isSidebarOpen} onClose={toggleSidebar} variant={variants?.navigation} />
                    <Box marginLeft={!variants?.navigationButton ? '200px' : ''} zIndex={1000}>
                        <Header onShowSidebar={toggleSidebar} showSidebarButton={variants?.navigationButton} />
                    </Box>
                </Box>
                <Box maxH="100vh" overflowY="auto" w="100%" zIndex={100}>
                    <Outlet />
                </Box>
            </Flex>
            <Flex></Flex>
        </>
    )
}

export default Dashboard
