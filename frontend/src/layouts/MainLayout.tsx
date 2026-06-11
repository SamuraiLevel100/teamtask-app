import { Box } from "@mui/material";
import Navbar from "../components/Navbar";

interface Props {
    children: React.ReactNode;
}

function MainLayout({
    children,
}: Props) {
    return (
        <>
            <Navbar />

            <Box
                sx={{
                    mt: 2,
                    px: 2,
                }}
            >
                {children}
            </Box>
        </>
    );
}

export default MainLayout;