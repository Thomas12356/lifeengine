import { Box } from '@chakra-ui/react';

export function WidgetBox({ children, ...props }){
    return(
        <Box
        bg={"brand.white"}
        paddingLeft={"widget.pLeftRight"}
        paddingRight={"widget.pLeftRight"}
        paddingTop={"widget.pTopBottom"}
        paddingBottom={"widget.pTopBottom"}
        borderRadius={"widgetRadii"}
        ml={"widget.mLeftRight"}
        mr={"widget.mLeftRight"}
        mt={"widget.mTopBottom"}
        {...props}>
            {children}
        </Box>
    );
}