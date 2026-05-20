{/* -------------------- Imports -------------------- */}
{/* Chakra UI */}
import { Icon as ChakraIcon, Text, Box, Flex, HStack, Center } from "@chakra-ui/react";
{/* Router */}
import { NavLink } from "react-router-dom";
{/* UI Components */}
import LifeEngineLogo from "@ui-components/LifeEngineLogo";
import VerticalDivider from "@ui-components/VerticalDivider";
{/* Assets */}
{/* TODO - replace with actual icons */}
{/* Temporary Dev Imports */}
import { FaBeer } from "react-icons/fa";
import LogoutButton from "@features/auth/components/LogoutButton";


{/* -------------------- Styling -------------------- */}
{/* NavLink Styles */}
const navButtonLinkStyles = {
    display: "flex",
    alignItems:"center",
    marginRight: "general.mdSpacing",
}
const iconNavButtonLinkStyles = {
    marginLeft: "general.xsSpacing",
}
const navButtonLinkTextStyles = {
    fontSize: "sm",
    marginLeft: "general.xsSpacing",
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
    height: "70px",
    alignContent: "center",
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
        <NavLink to={to} style={{ textDecoration: 'none', display: 'block' }}>
            {({ isActive }) => (
                <Box
                    {...navButtonLinkStyles}
                    color={isActive ? "blueLight.500" : "gray.500"}
                >
                    {/* TODO: icon size is hardcoded for now, will need to be changed when we have real icons */}
                    <ChakraIcon as={Icon} {...navBarIconStyles} />
                    {/* TODO: font size is hardcoded for now, will need to be changed when we have real text */}
                    <Text {...navButtonLinkTextStyles}>{text}</Text>
                    
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
                >
                    <ChakraIcon as={Icon} {...navBarIconStyles} />
                </Box>
            )}
        </NavLink>
    )
}

{/* -------------------- Main Component -------------------- */}
export default function NavBar() {
    return(
        <Box {...navBarBoxStyles}>
            <Flex justifyContent="space-between" alignItems="center" height="100%">

                <HStack height="100%">
                    <LifeEngineLogo />
                    <VerticalDivider />
                    <nav>
                        <HStack>
                            {navButtons.map((button) => (
                                <NavButton key={button.to} {...button} />
                            ))}
                        </HStack>
                    </nav>
                </HStack>

                <HStack height="100%">
                    {IconNavButtons.map((button) => (
                        <IconNavButton key={button.to} {...button} />
                    ))}
                    <LogoutButton/>
                </HStack>
            </Flex>
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