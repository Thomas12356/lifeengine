
import { Text, Field, Input, Stack, Box, HStack } from "@chakra-ui/react"
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
        <WidgetBox p={{ base: 4, md: 5 }} borderRadius="2xl">
            <Stack gap={5} minW={"280px"}>
                <Box>
                    <Text textStyle={"darkBlueText"}>
                        User Preferences
                    </Text>
                </Box>

                <Box
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.100"
                    borderRadius="xl"
                    p={4}
                >
                    <Stack gap={1}>
                        <Text textStyle="defaultText" fontWeight="semibold">
                            {user?.first_name || "User"}
                        </Text>

                        <Text textStyle="defaultText" color="gray.500" fontSize="sm">
                            {user?.email}
                        </Text>
                    </Stack>
                </Box>

                <Stack gap={4}>
                    <Field.Root>
                        <Field.Label>
                            <HStack gap={2}>
                                <LuSunrise />
                                <Text>Ideal wakeup time</Text>
                            </HStack>
                        </Field.Label>

                        <Input
                            type="time"
                            value={formData.wakeupTime}
                            onChange={(e) => updateField("wakeupTime", e.target.value)}
                            onBlur={handlePreferencesUpdate}
                            bg="white"
                            borderRadius="lg"
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>
                            <HStack gap={2}>
                                <RiMoonClearLine />
                                <Text>Ideal bed time</Text>
                            </HStack>
                        </Field.Label>

                        <Input
                            type="time"
                            value={formData.bedTime}
                            onChange={(e) => updateField("bedTime", e.target.value)}
                            onBlur={handlePreferencesUpdate}
                            bg="white"
                            borderRadius="lg"
                        />
                    </Field.Root>
                </Stack>
            </Stack>
        </WidgetBox>
    );
}