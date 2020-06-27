import { List } from "immutable";

import * as types from "./actions";

export const KEY = `ymap`;

export const initialState = List();

const reducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case types.ADD_POINT:
            return state.push(payload);

        case types.EDIT_POINT:
            return state.update(payload.index, (oldData) => ({
                ...oldData,
                ...payload.newData,
            }));

        case types.REMOVE_POINT:
            return state.delete(payload.index);

        case types.SWAP_POINTS:
            const { a, b } = payload;
            const aVal = state.get(a);
            const bVal = state.get(b);

            return state.set(a, bVal).set(b, aVal);

        default:
            return state;
    }
};

export default reducer;
