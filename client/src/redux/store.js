import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./theme";
import authReducer from "./auth";
import gudangReducer from "./gudang";
import barangReducer from "./barang";

export default configureStore({
    reducer: {
        theme: themeReducer,
        auth: authReducer,
        gudang: gudangReducer,
        barang: barangReducer
    }
});