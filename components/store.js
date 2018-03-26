import appReducer from "../reducers";
import {createStore} from "redux";

let store = createStore(appReducer);

export default store;