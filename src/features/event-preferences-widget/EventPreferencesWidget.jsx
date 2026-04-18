import { Text, Stack } from "@chakra-ui/react";
import { WidgetBox } from "@ui-components/WidgetBox";
import DropDown from "@ui-components/DropDown"

export default function EventPreferenceWidget({...props}){
    return(
        <WidgetBox {...props}>
            <Text textStyle={"headingSolid"}>Event Preferences</Text>
            <Stack mt={"general.xsSpacing"}>
            <DropDown type={"Energy Level:"} option={0}/>
            <DropDown type={"Focus Level:"} option={0}/>
            <DropDown type="Optimal Time From:" option={2}/>
            <DropDown type="Optimal Time Until:" option={2}/>
            <DropDown type={"Worst Time From:"} option={2}/>
            <DropDown type={"Worst Time Until:"} option={2}/>
            </Stack>
        </WidgetBox>
    );

}