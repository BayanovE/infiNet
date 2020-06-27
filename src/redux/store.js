import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from "redux-logger";

import ymap, { KEY as YMAP_KEY } from "./YMAP/reducer";

const store = createStore(
    combineReducers({
        [YMAP_KEY]: ymap,
    }),
    applyMiddleware(logger)
);

export default store;
