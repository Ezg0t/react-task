import { Button, FormControl, FormHelperText, Input, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { usePostDishMutation } from "../../services/dishesApi";
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { useState, useEffect } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from "dayjs";
import { DishPostBody, DishPostResponse } from '../types/dishes';


export const AddDishForm = () => {
    const [postDish, { data, error, isLoading }] = usePostDishMutation()
    const [dishName, setDishName] = useState('' as string)
    const [preparation_time, setPreparation_time] = useState<Dayjs | null>(dayjs('2022-04-17T00:00'));
    const [type, setType] = useState('' as string)
    const [additionalFields, setAdditionalFields] = useState([] as any[])
    const [no_of_slices, setNo_of_slices] = useState(0 as number)
    const [diameter, setDiameter] = useState(0 as number)
    const [spiciness_scale, setSpiciness_scale] = useState(0 as number)
    const [slices_of_bread, setSlices_of_bread] = useState(0 as number)
    const DishPostBody = {
        "name": "HexOcean pizza",
        "preparation_time": "01:30:22",
        "type": "pizza", "no_of_slices": 4,
        "diameter": 33.4
    }
    // const DishPostBody = {
    //     name: dishName,
    //     preparation_time: preparation_time,
    //     type: type,
    //     no_of_slices?: no_of_slices,
    //     diameter?: diameter,
    //     spiciness_scale?: spiciness_scale,
    //     slices_of_bread?: slices_of_bread
    // }
    const handleAddDish = () => {
        postDish(DishPostBody).unwrap()
            .then((res) => {
                console.log(res)
            }
            )
            .catch((err) => {
                console.log(err)
            }
            )
    }
    useEffect(() => {
        switch (type) {
            case "Pizza":

                setAdditionalFields([
                    <TextField
                        key="no of slices"
                        fullWidth
                        required
                        value={no_of_slices === 0 ? '' : no_of_slices} id="outlined-basic" label="Number of slices"
                        variant="outlined"
                        onChange={(e) => setNo_of_slices(parseInt(e.target.value))}
                    />,
                    <TextField
                        key="diameter"
                        fullWidth
                        required
                        value={diameter === 0 ? '' : diameter} id="outlined-basic" label="Diameter" variant="outlined"
                        onChange={(e) => setDiameter(parseFloat(e.target.value))}
                    />
                ])
                break;
            case "Soup":
                setAdditionalFields([
                    <TextField
                        key="spiciness scale"
                        fullWidth
                        required
                        value={spiciness_scale === 0 ? '' : spiciness_scale} id="outlined-basic" label="Spiciness scale"
                        variant="outlined"
                        onChange={(e) => setSpiciness_scale(parseInt(e.target.value))}
                    />
                ])
                break;
            case "Sandwich":
                setAdditionalFields([
                    <TextField
                        key="slices of bread"
                        fullWidth
                        required
                        value={slices_of_bread === 0 ? '' : slices_of_bread} id="outlined-basic" label="Slices of bread"
                        variant="outlined"
                        onChange={(e) => setSlices_of_bread(parseInt(e.target.value))}
                    />
                ])
        }

    }, [type])
    return (
        <>
            <div>
                <h1>AddDish</h1>
                <TextField
                    fullWidth
                    required
                    value={dishName} id="outlined-basic" label="Dish name" variant="outlined"
                    onChange={(e) => setDishName(e.target.value)}
                />

                <TimeField
                    label="Preparation time (HH:mm:ss)"
                    value={preparation_time}
                    onChange={(newValue) => setPreparation_time(newValue)}
                    format="HH:mm:ss"
                />
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={type}
                        label="Age"
                        onChange={(e) => setType(e.target.value)}
                    >
                        <MenuItem value="Pizza">Pizza</MenuItem>
                        <MenuItem value="Soup">Soup</MenuItem>
                        <MenuItem value="Sandwich">Sandwich</MenuItem>
                    </Select>
                </FormControl>
                {additionalFields}
                <Button className="modalBtn" variant="outlined"
                    onClick={handleAddDish}
                    disabled={!dishName || !preparation_time}>

                    Add dish
                </Button>
            </div>
        </>
    );
};

// startIcon={<CheckIcon />}
// onClick={ }>
// {/* // disabled={!nazwa || !stawka || !haslo_dostepu}> */}


export default AddDishForm;