import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

export default function PublicOnlyRoute(){
    const { user } = useAuth();

    if (user){
        return <Navigate to='/home' replace />;
    }
    return <Outlet/>;
}