import { Button, useColorMode } from '@chakra-ui/react'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import { Explore } from './pages/Explore'
import Landing from './pages/Landing'
import Login from './pages/Login'
import { Profile } from './pages/Profile'
import Register from './pages/Register'
// import Post from './pages/Post';
import ProtectedRoute from './components/ProtectedRoute'
import Uploads from './pages/Uploads'
import useStore from './store/store'

function App() {
    const { colorMode, toggleColorMode } = useColorMode()
    const store = useStore()
    const loggedIn: boolean = store.loggedIn
    return (
        <>
            <Button display={'none'} onClick={toggleColorMode} position={'absolute'}>
                Toggle {colorMode} theme
            </Button>
            <Router>
                <Routes>
                    <Route element={<Landing />} path="/"></Route>
                    <Route element={<Login />} path="login" />
                    <Route element={<Register />} path="register" />
                    <Route
                        element={
                            <ProtectedRoute loggedIn={loggedIn}>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                        path="dashboard"
                    >
                        <Route element={<Uploads />} path="home" />
                        <Route element={<Profile />} path="profile" />
                        <Route element={<Explore />} path="explore" />
                    </Route>
                    <Route element={<Navigate replace to={loggedIn ? '/dashboard/home' : '/login'} />} path="*" />
                    {/* <Route element={<Post />} path='/post' /> */}
                </Routes>
            </Router>
        </>
    )
}

export default App
