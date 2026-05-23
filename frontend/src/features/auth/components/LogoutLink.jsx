import { Link } from '@chakra-ui/react';
import { logoutUser } from '@features/auth/utils/authService';

export default function LogoutLink(){
    function handleLogout(){
        logoutUser();
    }
    return (
        <Link ml="5px" variant="plain" color="#71717A" onClick={handleLogout}>Log Out</Link>
    )
}