import { Link as ChakraLink, Icon as ChakraIcon, Text, Box, Flex, HStack } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
//components
import LifeEngineLogo from "@ui-components/LifeEngineLogo";
//test icons
import { FaBeer } from "react-icons/fa";

//TODO style logo properly 


const NavLinkStyles = {
    display: "flex",
    alignItems:"center"
}

const NavButtons = [
  { to: "/", Icon: FaBeer, text: "Home" },
  { to: "/calendar", Icon: FaBeer, text: "Calendar" },
];

const NavButton = ({ to, Icon, text}) => {
    return(
        <NavLink to={to} style={{ textDecoration: 'none', display: 'block' }}>
            {({ isActive }) => (
                <Box
                    {...NavLinkStyles}
                    color={isActive ? "brand.blueLight" : "brand.gray"}
                >
                    {/* TODO: icon size is hardcoded for now, will need to be changed when we have real icons */}
                    <ChakraIcon as={Icon} boxSize="20px" />
                    {/* TODO: font size is hardcoded for now, will need to be changed when we have real text */}
                    <Text fontSize = "sm">{text}</Text>
                </Box>
            )}
        </NavLink>
    )
}

export default function NavBar() {
    return(
        <Box bg="white" borderRadius="widgetRadii" marginLeft="MWidgetLeftRight" marginRight="MWidgetLeftRight" marginTop="MWidgetTop" paddingLeft="PWidgetLeftRight" paddingRight="PWidgetLeftRight" paddingTop="PWidgetTopBottom" paddingBottom="PWidgetTopBottom">
            <Flex justifyContent="space-between" alignItems="center">

                <LifeEngineLogo />

                <nav>
                    {/* TODO: Style the nav buttons, currently just using the same icon for all of them */}
                    <HStack>
                        {NavButtons.map((button) => (
                            <NavButton key={button.to} {...button} />
                        ))}
                    </HStack>
                </nav>

            </Flex>
        </Box>
    )
}