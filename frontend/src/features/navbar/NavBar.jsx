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
import { TiThMenuOutline } from "react-icons/ti";
import LogoutLink from "@/features/auth/components/LogoutLink";


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
    //alignContent: "center",
    py: 2,
}


{/* -------------------- Config -------------------- */}
const navButtons = [
    { to: "/home", Icon: FaBeer, text: "Home" },
    { to: "/calendar", Icon: FaBeer, text: "Calendar" },
    { to: "/habits", Icon: FaBeer, text: "Habits" },
    { to: "/insights", Icon: FaBeer, text: "Insights" },
    { to: "/agent", Icon: FaBeer, text: "Agent" },
    { to: "/profile", Icon: FaBeer, text: "Profile" },
    { to: "/social", Icon: FaBeer, text: "Social" },
];

const IconNavButtons = [
    { to: "/notifications", Icon: FaBeer },
]

{/* -------------------- Local Components -------------------- */}
const NavButton = ({ to, Icon, text}) => {
    return(
        <NavLink to={to} style={{ textDecoration: 'none', display: 'block', width: "100%"}}>
            {({ isActive }) => (
                <Box
                    {...navButtonLinkStyles}
                    color={isActive ? "blueLight.500" : "gray.500"}
                    p={{ base: 2, md: 0 }} //padding for smaller screens, easier to click
                    _hover={{ bg: {base: "gray.100", md: "transparent"}, borderRadius: "md" }} //hover effect
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
                    p={{ base: 2, md: 0 }} //padding for smaller screens, easier to click
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

    return(
        <Box {...navBarBoxStyles}>
            <Flex justifyContent="space-between" alignItems="center" minHeight="54px">
                
                {/* Left Side: Logo and Desktop Nav Buttons */}
                <HStack gap="general.mdSpacing" height="100%">
                    <LifeEngineLogo />

                    {/* Hide links on smaller screens than md*/}
                    <Box display={{ base: "none", md: "flex" }} alignItems="center" gap={4}>
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
                    <HStack display={{ base: "none", md: "flex" }} gap="general.xsSpacing">
                        {IconNavButtons.map((button) => (
                            <IconNavButton key={button.to} {...button} />
                        ))}
                        <LogoutLink/>
                    </HStack>

                    {/* Mobile Toggle Menu */}
                    <Box
                        display={{ base: "block", md: "none" }}
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        cursor="pointer"
                        p={2}
                    >
                        <ChakraIcon as={TiThMenuOutline} boxSize="28px" color="gray.500"/>
                    </Box>
                </HStack>
            </Flex>

            {/* Mobile Dropdown Nav */}
            <Box display={{ base: isMobileOpen ? "block" : "none", md: "none" }} py={4}>
                <VStack align="strech" gap={2}>
                    {navButtons.map((button) => (
                        <NavButton key={button.to} {...button} />
                    ))}
                    <Center>
                    <LogoutLink/>
                    </Center>
                </VStack>
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