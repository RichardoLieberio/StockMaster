import { createSlice } from "@reduxjs/toolkit";

export const gudangSlice = createSlice({
    name: "gudang",
    initialState: {
        gudang: []
    },
    reducers: {
        setGudang: function (state, action) {
            state.gudang = action.payload;
        },
        addGudang: function (state, action) {
            state.gudang = [...state.gudang, action.payload];
        },
        editGudang: function (state, action) {
            state.gudang = state.gudang.map(gudang => gudang._id === action.payload._id ? action.payload : gudang);
        },
        removeGudang: function (state, action) {
            state.gudang = state.gudang.filter(gudang => gudang._id !== action.payload._id);
        },
        clearGudang: function (state) {
            state.gudang = [];
        }
    }
});

export const { setGudang, addGudang, editGudang, removeGudang, clearGudang } = gudangSlice.actions;

export default gudangSlice.reducer;