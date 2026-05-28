{/* -------------------- Imports -------------------- */}
import { useState } from "react";
{/* Chakra UI */}
import { Icon as ChakraIcon, Text, Box, Flex, HStack, VStack, Center } from "@chakra-ui/react";
{/* Router */}
import { NavLink } from "react-router-dom";
{/* UI Components */}
import LifeEngineLogo from "@ui-components/LifeEngineLogo";
import { VerticalDivider } from "@/components/ui-components/Dividers";
{/* Assets */}
{/* TODO - replace with actual icons */}
{/* Temporary Dev Imports */}
import { FaBeer } from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";
import { GoHomeFill } from "react-icons/go";
import { FaCalendar } from "react-icons/fa6";
import { RiChatAiFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";

import LogoutButton from "@/features/auth/components/LogoutButton"


{/* -------------------- Styling -------------------- */}
{/* NavLink Styles */}
const navButtonLinkStyles = {
    display: "flex",
    alignItems:"center",
}
const iconNavButtonLinkStyles = {
}

const navBarIconStyles = {
    boxSize: "20px",
}

{/* NavBar Styles */}
const navBarBoxStyles = {
    bg: "white",
    boxShadow: "md",
    borderRadius: "widgetRadii",
    marginLeft: "widget.mLeftRight",
    marginRight: "widget.mLeftRight",
    mt: "widget.mTopBottom",
    mb: "widget.mTopBottom",
    paddingLeft: "widget.pLeftRight",
    paddingRight: "widget.pLeftRight",
    minHeight: "70px",
    alignContent: "center",
}


{/* -------------------- Config -------------------- */}
const navButtons = [
    { to: "/home", Icon: GoHomeFill, text: "Home" },
    { to: "/calendar", Icon: FaCalendar, text: "Calendar" },
    //{ to: "/habits", Icon: FaBeer, text: "Habits" },
    //{ to: "/insights", Icon: FaBeer, text: "Insights" },
    { to: "/agent", Icon: RiChatAiFill, text: "Agent" },
    { to: "/profile", Icon: FaUser, text: "Profile" }
    //{ to: "/social", Icon: FaBeer, text: "Social" },
];

const IconNavButtons = [
    { to: "/notifications", Icon: IoNotifications },
]

{/* -------------------- Local Components -------------------- */}
const NavButton = ({ to, Icon, text, onClick}) => {
    return(
        <NavLink to={to} onClick={onClick} style={{ textDecoration: 'none', display: 'block', width: "100%"}}>
            {({ isActive }) => (
                <Box
                    {...navButtonLinkStyles}
                    color={isActive ? "blueLight.500" : "gray.500"}
                    p={{ base: 2, xl: 0 }} //padding for smaller screens, easier to click
                    _hover={{ bg: {base: "gray.100", xl: "transparent"}, borderRadius: "md" }} //hover effect
                >
                    {/* TODO: icon size is hardcoded for now, will need to be changed when we have real icons */}
                    <ChakraIcon as={Icon} {...navBarIconStyles} color="inherit" />
                    {/* TODO: font size is hardcoded for now, will need to be changed when we have real text */}
                    <Text ml={2} textStyle="navLinkText" color="inherit">{text}</Text>
                    
                </Box>
            )}
        </NavLink>
    )
}

const IconNavButton = ({ to, Icon }) => {
    return(
        <NavLink to={to} style={{ textDecoration: 'none', display: 'block'}}>
            {({ isActive }) => (
                <Box
                    {...iconNavButtonLinkStyles}
                    color={isActive ? "blueLight.500" : "gray.500"}
                    p={{ base: 2, xl: 0 }} //padding for smaller screens, easier to click
                >
                    <ChakraIcon as={Icon} {...navBarIconStyles} />
                </Box>
            )}
        </NavLink>
    )
}

{/* -------------------- Main Component -------------------- */}
export default function NavBar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleCloseMenu = () => {
        setIsMobileOpen(false);
    };

    return(
        <Box {...navBarBoxStyles}>
            <Flex justifyContent="space-between" alignItems="center" height="70px">
                
                {/* Left Side: Logo and Desktop Nav Buttons */}
                <HStack gap="general.mdSpacing" height="100%">
                    <LifeEngineLogo />
                    {/* Hide links on smaller screens than md*/}
                    <Box display={{ base: "none", xl: "flex" }} alignItems="center" gap={4}>
                    <VerticalDivider />
                    <nav>
                        <HStack gap="general.mdSpacing">
                            {navButtons.map((button) => (
                                <NavButton key={button.to} {...button} />
                            ))}
                        </HStack>
                    </nav>
                    </Box>
                </HStack>

                {/* Right Side: Desktop Icon Buttons and Mobile Toggle Menu */}
                <HStack gap={4} height="100%">
                    {/* Desktop Only */}
                    <HStack display={{ base: "none", xl: "flex" }} gap="general.xsSpacing">
                        {IconNavButtons.map((button) => (
                            <IconNavButton key={button.to} {...button} />
                        ))}
                        <LogoutButton/>
                    </HStack>

                    {/* Mobile Toggle Menu */}
                    <Box
                        display={{ base: "block", xl: "none" }}
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        cursor="pointer"
                        p={2}
                    >
                        <ChakraIcon as={IoIosMenu} boxSize="28px" color="gray.500"/>
                    </Box>
                </HStack>
            </Flex>

            {/* Mobile Dropdown Nav */}
            <Box 
                display={{ base: "block", xl: "none" }}
                overflow="hidden"
                transition="all 0.3s ease-in-out"
                maxHeight={isMobileOpen ? "400px" : "0px"} // expands and collapses
                opacity={isMobileOpen ? 1 : 0} // fades in and ou
            >
                <Box py={4}>
                    <VStack align="stretch" gap={2}>
                        {navButtons.map((button) => (
                            <NavButton 
                                key={button.to} 
                                {...button} 
                                onClick={handleCloseMenu} 
                            />
                        ))}
                        <Center>
                            <LogoutButton isMobile={true}/>
                        </Center>
                    </VStack>
                </Box>
            </Box>

            
        </Box>
    )
}

export function NavBarLogin(){
    return(
        <Box {...navBarBoxStyles}>
            <Center><LifeEngineLogo /></Center>
        </Box>
    )
}