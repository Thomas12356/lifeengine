import { Box, Text } from '@chakra-ui/react';
import { Tooltip } from "@/components/ui/tooltip"
import { IoLogOut } from "react-icons/io5";
import { logoutUser } from '@features/auth/utils/authService';

export default function LogoutButton( { isMobile }) {
  return (
    <Tooltip 
        content="Log out"
        disabled={isMobile}
        contentProps={{
        bg: "white",
        color: "gray.500",
        px: 3,
        py: 1.5,
        borderRadius: "md",
        fontSize: "sm",
        fontWeight: "normal",
        boxShadow: "md",
    }}>
        <Box
            as="button"
            onClick={logoutUser}
            aria-label="Log out"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            fontSize="24px" 
            background="none"
            border="none"
            gap={2}
            color="gray.500"
            p={{ base: 2, xl: 0 }} //padding for smaller screens, easier to click
            _hover={{ bg: {base: "gray.100", xl: "transparent"}, borderRadius: "md" }} //hover effect
        >
            <IoLogOut />
            {isMobile && (
                <Text textStyle="navLinkText">
                    Logout
                </Text>
            )}
        </Box>
    </Tooltip>
  );
}