import {
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
} from "@mui/material";

interface Props {
    board: any;
    onDelete: (id: number) => void;
}

function BoardCard({
    board,
    onDelete,
}: Props) {
    return (
        <Card>
            <CardContent>
                <Typography
                    variant="h6"
                    gutterBottom
                >
                    {board.title}
                </Typography>

                <Stack
                    direction="row"
                    spacing={1}
                >
                    <Button
                        variant="contained"
                    >
                        Open
                    </Button>

                    <Button
                        color="error"
                        variant="outlined"
                        onClick={() =>
                            onDelete(board.id)
                        }
                    >
                        Delete
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default BoardCard;