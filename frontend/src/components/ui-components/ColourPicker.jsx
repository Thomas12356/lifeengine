import { ColorPicker, parseColor } from "@chakra-ui/react"

export default function ColourPicker({ value, onChange }) {

    const swatches = [ // Default swatch values, we could allow the user to set their own in the future
        "#3182CE",
        "#38A169",
        "#805AD5",
        "#DD6B20",
        "#E53E3E",
        "#718096",
    ]

    const pickerValue = parseColor(value || "#3182CE")

    return (
        <ColorPicker.Root
            value={pickerValue}
            onValueChange={(e) => {
                onChange(e.value.toString("hex"))
            }}
        >
            <ColorPicker.HiddenInput />
            <ColorPicker.Label />
            <ColorPicker.Control>
                <ColorPicker.Input />
                <ColorPicker.Trigger />
            </ColorPicker.Control>
            <ColorPicker.Positioner>
                <ColorPicker.Content>
                <ColorPicker.Area />
                <ColorPicker.EyeDropper />
                <ColorPicker.Sliders />
                <ColorPicker.SwatchGroup>
                    {swatches.map((colour) => (
                        <ColorPicker.SwatchTrigger
                            key={colour}
                            value={parseColor(colour)}
                        >
                        <ColorPicker.Swatch value={parseColor(colour)}/>
                        </ColorPicker.SwatchTrigger>
                    ))}
                </ColorPicker.SwatchGroup>
                </ColorPicker.Content>
            </ColorPicker.Positioner>
        </ColorPicker.Root>
    )
}