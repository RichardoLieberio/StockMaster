import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "authentication",
    initialState: {
        token: null,
        user: null
    },
    reducers: {
        setToken: function (state, action) {
            state.token = action.payload;
        },
        clearToken: function (state) {
            state.token = null;
        },
        setUser: function (state, action) {
            state.user = action.payload;
        },
        clearUser: function (state) {
            state.user = null;
        }
    }
});

export const { setToken, clearToken, setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;