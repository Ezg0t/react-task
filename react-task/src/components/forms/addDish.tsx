import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { usePostDishMutation } from "../../services/dishesApi";
import { useState, useEffect, useRef } from "react";
import TimeField from 'react-simple-timefield';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';

export const AddDishForm = () => {
    const [postDish, { isLoading }] = usePostDishMutation()
    const [dishName, setDishName] = useState('' as string)
    const [preparation_time, setPreparation_time] = useState<string>("00:00:00")
    const [type, setType] = useState('' as string)
    const [additionalFields, setAdditionalFields] = useState([] as JSX.Element[])
    const [no_of_slices, setNo_of_slices] = useState<number | undefined>(undefined)
    const [diameter, setDiameter] = useState<number | undefined>(undefined)
    const [spiciness_scale, setSpiciness_scale] = useState<number | undefined>(undefined)
    const [slices_of_bread, setSlices_of_bread] = useState<number | undefined>(undefined)
    const [requiredFields, setRequiredFields] = useState([] as string[])

    const PositiveInt = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace']
    const PositiveFloat = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', ',', '.']

    const noOfSlicesRef = useRef(no_of_slices);
    const DiameterRef = useRef(diameter);
    const SpicinessScaleRef = useRef(spiciness_scale);
    const SlicesOfBreadRef = useRef(slices_of_bread);
    useEffect(() => {
        noOfSlicesRef.current = no_of_slices;
        DiameterRef.current = diameter;
        SpicinessScaleRef.current = spiciness_scale;
        SlicesOfBreadRef.current = slices_of_bread;
    }, [no_of_slices, diameter, spiciness_scale, slices_of_bread]);


    const notifySuccess = (text: string) => toast.success(text, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
    const notifyFailure = (text: string) => toast.error(text, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });

    const DishPostBody = {
        "name": dishName,
        "preparation_time": preparation_time,
        "type": type,
        ...(type === "pizza" && {
            "no_of_slices": no_of_slices,
            "diameter": diameter
        }),
        ...(type === "soup" && {
            "spiciness_scale": spiciness_scale
        }),
        ...(type === "sandwich" && {
            "slices_of_bread": slices_of_bread
        })
    };
    const handleAddDish = () => {
        if (preparation_time === "00:00:00") {
            notifyFailure("Preparation time cannot be 00:00:00")
            return
        }

        postDish(DishPostBody).unwrap()
            .then((res) => {
                notifySuccess("Dish added successfully")
                console.log(res)
            }
            )
            .catch((err) => {
                let errorFound = false
                for (const field in DishPostBody) {
                    if (err.data && err.data[field]) {
                        notifyFailure(`${field} - ${err.data[field]}`)
                        errorFound = true
                    }
                }
                if (!errorFound) {
                    notifyFailure("Something went wrong")
                }


            }
            )
    }


    useEffect(() => {
        setNo_of_slices(undefined)
        setDiameter(undefined)
        setSpiciness_scale(undefined)
        setSlices_of_bread(undefined)
        switch (type) {
            case "pizza":
                setRequiredFields(['no_of_slices', 'diameter'])
                setAdditionalFields([
                    <TextField
                        className="text-field"
                        InputLabelProps={{ shrink: true }}
                        key="no of slices"
                        fullWidth
                        type="number"
                        required
                        inputProps={{ min: 1 }}
                        value={no_of_slices}
                        id="outlined-basic" label="Number of slices"
                        variant="outlined"
                        onChange={
                            (e) => setNo_of_slices(Number(e.target.value))
                        }
                        onKeyDown={(event) => {
                            if (
                                event.key === "0" &&
                                (noOfSlicesRef.current === undefined || noOfSlicesRef.current === 0
                                    || isNaN(noOfSlicesRef.current))
                            ) {
                                event.preventDefault();
                            }
                            if (!PositiveInt.includes(event.key)) {
                                event.preventDefault();
                            }
                        }}
                    />,
                    < TextField
                        className="text-field"
                        InputLabelProps={{ shrink: true }}
                        key="diameter"
                        type="number"
                        inputProps={{ min: 1 }}
                        fullWidth
                        required
                        value={diameter} id="outlined-basic" label="Diameter" variant="outlined"
                        onChange={(e) => setDiameter(parseFloat(e.target.value))}
                        onKeyDown={(event) => {
                            if ((event.key === "0" || event.key === "," || event.key === ".")
                                && (DiameterRef.current === undefined || isNaN(DiameterRef.current)
                                    || DiameterRef.current === 0)) {
                                event.preventDefault();
                            }

                            if (!PositiveFloat.includes(event.key)) {
                                event.preventDefault();
                            }
                        }}
                    />,
                ])

                break;
            case "soup":
                setRequiredFields(['spiciness_scale'])
                setAdditionalFields([
                    <TextField
                        className="text-field"
                        InputLabelProps={{ shrink: true }}
                        key="spiciness scale"
                        fullWidth
                        required
                        type="number"
                        inputProps={{ min: 1, max: 10 }}
                        value={spiciness_scale} id="outlined-basic" label="Spiciness scale (1-10)"
                        variant="outlined"
                        onChange={(e) => setSpiciness_scale(Number(e.target.value))}
                        onKeyDown={(event) => {
                            if (event.key === "0" && (SpicinessScaleRef.current === undefined || SpicinessScaleRef.current === 0
                                || isNaN(SpicinessScaleRef.current))) {
                                event.preventDefault();
                            }
                            if (!PositiveInt.includes(event.key) ||
                                (Number(SpicinessScaleRef.current?.toString() + event.key.toString()) > 10)) {
                                event.preventDefault();
                            }
                        }}
                    />
                ])
                break;
            case "sandwich":
                setRequiredFields(['slices_of_bread'])
                setAdditionalFields([
                    <TextField
                        className="text-field"
                        InputLabelProps={{ shrink: true }}
                        key="slices of bread"
                        fullWidth
                        required
                        type="number"
                        value={slices_of_bread} id="outlined-basic" label="Slices of bread required"
                        variant="outlined"
                        onChange={(e) => setSlices_of_bread(Number(e.target.value))}
                        onKeyDown={(event) => {
                            if (event.key === "0" && (SlicesOfBreadRef.current === undefined || SlicesOfBreadRef.current === 0
                                || isNaN(SlicesOfBreadRef.current))) {
                                event.preventDefault();
                            }
                            if (!PositiveInt.includes(event.key)) {
                                event.preventDefault();
                            }
                        }}
                    />
                ])
        }

    }, [type])
    useEffect(() => {
        setRequiredFields([...requiredFields, 'dishName', 'type', 'preparation_time'])
    }, [additionalFields])
    const isAnyRequiredFieldEmpty = requiredFields.some(field => {
        switch (field) {
            case 'dishName':
                return dishName === '';
            case 'type':
                return type === '';
            case 'preparation_time':
                return preparation_time === "";
            case 'no_of_slices':
                return no_of_slices === undefined || Number.isNaN(no_of_slices) || no_of_slices === 0;
            case 'diameter':
                return diameter === undefined || Number.isNaN(diameter) || diameter === 0;
            case 'spiciness_scale':
                return spiciness_scale === undefined || Number.isNaN(spiciness_scale) || spiciness_scale === 0;
            case 'slices_of_bread':
                return slices_of_bread === undefined || Number.isNaN(slices_of_bread) || slices_of_bread === 0;
            default:
                return false;
        }
    });
    const handlePreparationTimeChange = (event: string) => {
        setPreparation_time(event);
    };
    return (
        <>
            <div className="form-box">
                <h1>Add new dish</h1>
                <TextField className="text-field"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                    type="text"
                    value={dishName} id="outlined-basic"
                    label="Dish name"
                    variant="outlined"
                    onChange={(e) => setDishName(e.target.value)}
                />
                <TimeField
                    showSeconds
                    value={preparation_time}
                    onChange={(e) => handlePreparationTimeChange(e.target.value)}
                    input={<TextField
                        className="text-field"
                        fullWidth
                        label="Preparation time (HH:MM:SS)"
                        value={preparation_time}
                        variant="outlined" />}
                />

                <FormControl
                    fullWidth>
                    <InputLabel
                        shrink
                        id="demo-simple-select-label">Type*</InputLabel>
                    <Select
                        sx={{ textAlign: "left" }}
                        notched
                        className="text-field"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={type}
                        label="Type"
                        onChange={(e) => setType(e.target.value)}
                    >
                        <MenuItem value="pizza">pizza</MenuItem>
                        <MenuItem value="soup">soup</MenuItem>
                        <MenuItem value="sandwich">sandwich</MenuItem>
                    </Select>
                </FormControl>
                {additionalFields}
                <Button className="modalBtn" variant="outlined"
                    onClick={handleAddDish}
                    disabled={isAnyRequiredFieldEmpty}
                >

                    Add dish
                </Button>
                {isAnyRequiredFieldEmpty && <p className="required-fields">All fields must be filled</p>}
                {isLoading && <p><CircularProgress size={"1.5em"} /></p>}

            </div>

            <div>

                <ToastContainer
                    position="bottom-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </div>

        </>
    );
};


export default AddDishForm;