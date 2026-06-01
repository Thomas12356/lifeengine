
import { Text, Field, Input, Stack } from "@chakra-ui/react"
import { WidgetBox } from "@ui-components/WidgetBox";
import { LuSunrise } from "react-icons/lu";
import { RiMoonClearLine } from "react-icons/ri";
import { useState, useEffect } from "react"
import { updatePreferences, getUserPreferences } from "./utils/userService";


export default function UserMenu() {

    const user = JSON.parse(localStorage.getItem("user"))

    const [formData, setFormData] = useState({
        wakeupTime : "",
        bedTime : ""
    })

    function updateField(field, value) {
        setFormData((prev) => ({
            ...prev,
            [field] : value
        }))
    }

    async function handlePreferencesUpdate() {
        const user = JSON.parse(localStorage.getItem("user"))

        const payload = {
            user_id: user.id,
            wakeup_time: formData.wakeupTime,
            bed_time: formData.bedTime,
        }

        console.log(payload)

        try {
            await updatePreferences(payload)
        } catch (err) {
            console.log("Failed to update preferences:", err)
        }
    }

    useEffect(() => {
        async function loadPreferences() {
            if (!user?.id) return

            try {
                const preferences = await getUserPreferences(user.id)
                console.log(preferences)
                setFormData({
                    wakeupTime: preferences.wakeup_time,
                    bedTime: preferences.bed_time
                })
            } catch (err) {
                console.log("Failed to load preferences:", err)
            }
        }

        loadPreferences()
    }, [user?.id])

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
                        onBlur={handlePreferencesUpdate}
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
                        onBlur={handlePreferencesUpdate}
                    />
                </Field.Root>
            </Stack>
        </WidgetBox>
    )
}