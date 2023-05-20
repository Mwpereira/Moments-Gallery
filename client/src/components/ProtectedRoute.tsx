import { Navigate } from 'react-router-dom'
import { ProtectedRouteInterface } from '../interfaces/ProtectedRouteInterface'

const ProtectedRoute = ({ loggedIn, redirectPath = '/login', children }: ProtectedRouteInterface) => {
    if (!loggedIn) {
        return <Navigate replace to={redirectPath} />
    }

    return children
}

export default ProtectedRoute
