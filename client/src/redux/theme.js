import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
    name: "theme",
    initialState: {
        mode: "light"
    },
    reducers: {
        setMode: function (state, action) {
            state.mode = action.payload;
        },
        toggleMode: function (state) {
            state.mode = state.mode === "light" ? "dark" : "light";
        }
    }
});

export const { setMode, toggleMode } = themeSlice.actions;

export default themeSlice.reducer;