import React, {useState, useEffect} from "react";
import { Stack, Button } from "@mui/material";
import ODSelection from "./ODSelection";
import Grid from "./PositionGrid";
import ODRes from "./ODRes";

const OD = ({tabId, objects, selectedObject, setSelectedObject, handleAddBox, results}) => {

    // Handle reset
    const [reset, setReset] = useState(false);
    const handleReset = () => {
        setReset(true); // Trigger reset
    };

    return (
        <Stack spacing={2} alignItems='center' justifyContent="center">
            <Stack spacing={2} direction="row">
            <ODSelection
                objects={objects}
                selectedObject={selectedObject}
                onSelectObject={setSelectedObject}
            />
            <Button onClick={handleReset}>Reset</Button>
            </Stack>
            <Grid tabId={tabId} onAddBox={handleAddBox} selectedObject={selectedObject} onReset={reset} confirmedRes={results} />
            <ODRes results={results} />
        </Stack>
    )
}
export default OD;