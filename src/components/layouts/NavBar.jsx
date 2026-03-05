{/* -------------------- Imports -------------------- */}
{/* Chakra UI */}
import { Link as ChakraLink, Icon as ChakraIcon, Text, Box, Flex, HStack } from "@chakra-ui/react";
{/* Router */}
import { NavLink } from "react-router-dom";
{/* UI Components */}
import LifeEngineLogo from "@ui-components/LifeEngineLogo";
{/* Assets */}

{/* Temporary Dev Imports */}
import { FaBeer } from "react-icons/fa";


{/* -------------------- Styling -------------------- */}
{/* NavLink Styles */}
const navLinkStyles = {
    display: "flex",
    alignItems:"center",
    marginRight: "general.smSpacing",
}
const navLinkTextStyles = {
    fontSize: "sm",
    marginLeft: "general.xsSpacing",
}
const navBarIconStyles = {
    boxSize: "20px",
}
{/* NavBar Styles */}
const navBarBoxStyles = {
    bg: "white",
    borderRadius: "widgetRadii",
    marginLeft: "widget.mLeftRight",
    marginRight: "widget.mLeftRight",
    marginTop: "widget.mTop",
    paddingLeft: "widget.pLeftRight",
    paddingRight: "widget.pLeftRight",
    paddingTop: "widget.pTopBottom",
    paddingBottom: "widget.pTopBottom"
}


{/* -------------------- Config -------------------- */}
const navButtons = [
    { to: "/", Icon: FaBeer, text: "Home" },
    { to: "/calendar", Icon: FaBeer, text: "Calendar" },
    { to: "/habits", Icon: FaBeer, text: "Habits" },
    { to: "/insights", Icon: FaBeer, text: "Insights" },
    { to: "/agent", Icon: FaBeer, text: "Agent" },
    { to: "/profile", Icon: FaBeer, text: "Profile" },
    { to: "/social", Icon: FaBeer, text: "Social" },
];

{/* -------------------- Local Components -------------------- */}
const NavButton = ({ to, Icon, text}) => {
    return(
        <NavLink to={to} style={{ textDecoration: 'none', display: 'block', ...navLinkStyles }}>
            {({ isActive }) => (
                <Box
                    {...navLinkStyles}
                    color={isActive ? "brand.blueLight" : "brand.gray"}
                >
                    {/* TODO: icon size is hardcoded for now, will need to be changed when we have real icons */}
                    <ChakraIcon as={Icon} {...navBarIconStyles} />
                    {/* TODO: font size is hardcoded for now, will need to be changed when we have real text */}
                    <Text {...navLinkTextStyles}>{text}</Text>
                </Box>
            )}
        </NavLink>
    )
}

{/* -------------------- Main Component -------------------- */}
export default function NavBar() {
    return(
        <Box {...navBarBoxStyles}>
            <Flex justifyContent="space-between" alignItems="center">

                <HStack>
                    <LifeEngineLogo />

                    <nav>
                        <HStack>
                            {navButtons.map((button) => (
                                <NavButton key={button.to} {...button} />
                            ))}
                        </HStack>
                    </nav>
                </HStack>

                <Text>TODO: Notifications and Settings</Text>

            </Flex>
        </Box>
    )
}