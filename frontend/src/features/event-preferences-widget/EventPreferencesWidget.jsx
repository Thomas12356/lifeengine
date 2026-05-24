import { Text, Stack } from "@chakra-ui/react";
import { WidgetBox } from "@ui-components/WidgetBox";
import DropDown from "@ui-components/DropDown"

export default function EventPreferenceWidget({...props}){
    return(
        <WidgetBox {...props}>
            <Stack direction={"row"}>
            <Text textStyle={"headingSolid"}>Event Preferences</Text>
            <DropDown title={"Energy"} type={"ResourceLevel"} option={0}/>
            </Stack>
            <Stack mt={"general.xsSpacing"}>
            <DropDown title={"Energy"} type={"ResourceLevel"} option={0}/>
            <DropDown title={"Focus"} type={"ResourceLevel"} option={0}/>
            <DropDown title="Optimal Time From:" type={"ResourceLevel"} option={2}/>
            <DropDown title="Optimal Time Until:" type={"ResourceLevel"} option={2}/>
            <DropDown title={"Worst Time From:"} type={"ResourceLevel"} option={2}/>
            <DropDown title={"Worst Time Until:"} type={"ResourceLevel"} option={2}/>
            </Stack>
        </WidgetBox>
    );

}