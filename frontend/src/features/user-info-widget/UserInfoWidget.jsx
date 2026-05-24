import { Text, Stack } from "@chakra-ui/react";
import { WidgetBox } from "@ui-components/WidgetBox";
import DropDown from "@ui-components/DropDown"

export default function UserInfoWidget({...props}){
    return(
        <WidgetBox {...props}>
            <Text textStyle={"headingSolid"}>Thomas Eardley</Text>
            <Text>te215@kent.ac.uk</Text>
            <Stack mt={"general.xsSpacing"}>
            <DropDown title={"Energy"} type={"ResourceLevel"} option={0}/>
            <DropDown title={"Focus"} type={"ResourceLevel"} option={0}/>
            <DropDown title={"Ideal Wake Up Time:"} type={"ResourceLevel"} option={2}/>
            <DropDown title={"Ideal Wake Up Time:"} type={"ResourceLevel"} option={2}/>
            </Stack>
        </WidgetBox>
    );

}