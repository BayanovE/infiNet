import { KEY } from "./reducer";

export const getState = (state) => state[KEY].toJS();
