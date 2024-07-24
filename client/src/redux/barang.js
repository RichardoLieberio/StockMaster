import { createSlice } from "@reduxjs/toolkit";

export const barangSlice = createSlice({
    name: "barang",
    initialState: {
        barang: {}
    },
    reducers: {
        setBarang: function (state, action) {
            state.barang = action.payload;
        },
        addBarang: function (state, action) {
            const newGudang = [...state.barang[action.payload.gudangId], action.payload];
            state.barang = {...state.barang, [action.payload.gudangId]: newGudang};
        },
        editBarang: function (state, action) {
            const newGudang = state.barang[action.payload.gudangId].map(barang => barang._id === action.payload._id ? action.payload : barang);
            state.barang = {...state.barang, [action.payload.gudangId]: newGudang};
        },
        removeBarang: function (state, action) {
            const newGudang = state.barang[action.payload.gudangId].filter(barang => barang._id !== action.payload._id);
            state.barang = {...state.barang, [action.payload.gudangId]: newGudang.length ? newGudang : []};
        },
        gudangDeleted: function (state, action) {
            const newGudang = {...state.barang};
            delete newGudang[action.payload._id];
            state.barang = newGudang;
        },
        clearBarang: function (state) {
            state.barang = {};
        }
    }
});

export const { setBarang, addBarang, editBarang, removeBarang, gudangDeleted, clearBarang } = barangSlice.actions;

export default barangSlice.reducer;