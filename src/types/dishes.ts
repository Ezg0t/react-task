export type DishPostBody = {
    name: string;
    preparation_time: string;
    type: string;
    no_of_slices?: number;
    diameter?: number;
    spiciness_scale?: number;
    slices_of_bread?: number;
};

export type DishPostResponse = {
    id: string;
    name: string;
    preparation_time: string;
    type: string;
    no_of_slices?: number;
    diameter?: number;
    spiciness_scale?: number;
    slices_of_bread?: number;
};