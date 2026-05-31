
import { Text, Field, Input, Stack } from "@chakra-ui/react"
import { WidgetBox } from "@ui-components/WidgetBox";
import { LuSunrise } from "react-icons/lu";
import { RiMoonClearLine } from "react-icons/ri";
import { useState, useEffect } from "react"


export default function UserMenu() {

    const user = JSON.parse(localStorage.getItem("user"))

    const dummyWakeup = "07:00"
    const dummySleep = "23:00"

    const [formData, setFormData] = useState({
        wakeupTime : dummyWakeup,
        bedTime : dummySleep
    })

    function updateField(field, value) {
        setFormData((prev) => ({
            ...prev,
            [field] : value
        }))
    }

    useEffect(() => { // Sumbit on change, will need review before backend wiring
        console.log("User preferences changed:", formData);
    }, [formData]);

    return (
        <WidgetBox>
            <Text textStyle={"headingSolid"}>
                User Preferences
            </Text>
            <Text>
                Name : {user.first_name}
            </Text>
            <Text>
                Email : {user.email}
            </Text>
            <Stack paddingTop={15}>
                <Field.Root>
                    <Field.Label>
                        Ideal wakeup time
                        <LuSunrise/>
                    </Field.Label>
                    <Input
                        type="time"
                        value={formData.wakeupTime}
                        onChange={(e) => updateField("wakeupTime", e.target.value)}
                    />
                </Field.Root>
                <Field.Root>
                    <Field.Label>
                        Ideal bed time
                        <RiMoonClearLine/>
                    </Field.Label>
                    <Input 
                        type="time"
                        value={formData.bedTime}
                        onChange={(e) => updateField("bedTime", e.target.value)}
                    />
                </Field.Root>
            </Stack>
        </WidgetBox>
    )
}