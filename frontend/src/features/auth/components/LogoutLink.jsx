import { Link } from '@chakra-ui/react';
import { logoutUser } from '@features/auth/utils/authService';

export default function LogoutLink(){
    function handleLogout(){
        logoutUser();
    }
    return (
        <Link ml="5px" variant="underline" color="defaultGrey" onClick={handleLogout}>Log Out</Link>
    )
}