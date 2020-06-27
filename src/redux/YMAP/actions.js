export const NAMESPACE = `YMAP`;

export const ADD_POINT = `${NAMESPACE}_ADD_POINT`;
export const REMOVE_POINT = `${NAMESPACE}_REMOVE_POINT`;
export const EDIT_POINT = `${NAMESPACE}_EDIT_POINT`;
export const SWAP_POINTS = `${NAMESPACE}_SWAP_POINTS`;

export const addPoint = (data) => {
    return {
        type: ADD_POINT,
        payload: data,
    };
};

export const removePoint = (index) => {
    return {
        type: REMOVE_POINT,
        payload: { index },
    };
};

export const editPoint = (index, data) => {
    return {
        type: EDIT_POINT,
        payload: {
            newData: data,
            index,
        },
    };
};

export const swapPoints = (a, b) => {
    return {
        type: SWAP_POINTS,
        payload: {
            a,
            b,
        },
    };
};
