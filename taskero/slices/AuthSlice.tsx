import { createSlice } from "@reduxjs/toolkit";

type TAuthState = {
    user: object | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: TAuthState = {
    user: null,
    accessToken: localStorage.getItem('AW_ACCESSTOKEN') || '',
    refreshToken: localStorage.getItem('AW_REFRESHTOKEN') || '',
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logIn: (state, action) => {
            // localStorage.setItem('AW_ACCESSTOKEN', action.payload.data?.accessToken);
            // localStorage.setItem('AW_REFRESHTOKEN', action.payload.data?.refreshToken);

            state.user = action.payload.data.profileData;
        },
        logOut: (state) => {
            state.user = null;
            state.accessToken = '';
            state.refreshToken = '';
            // localStorage.removeItem('AW_ACCESSTOKEN');
            // localStorage.removeItem('AW_REFRESHTOKEN');
        }
    }
})

export const { logIn, logOut } = authSlice.actions;
export default authSlice.reducer;