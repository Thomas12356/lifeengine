import { Text, Stack } from "@chakra-ui/react";
import { WidgetBox } from "@ui-components/WidgetBox";
import DropDown from "@ui-components/DropDown"

export default function UserInfoWidget({...props}){
    return(
        <WidgetBox {...props}>
            <Text textStyle={"headingSolid"}>Thomas Eardley</Text>
            <Text>te215@kent.ac.uk</Text>
            <Stack mt={"general.xsSpacing"}>
            <DropDown type={"Energy:"} option={0}/>
            <DropDown type={"Focus:"} option={0}/>
            <DropDown type={"Ideal Wake Up Time:"} option={2}/>
            <DropDown type={"Ideal Wake Up Time:"} option={2}/>
            </Stack>
        </WidgetBox>
    );

}