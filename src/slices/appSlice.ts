import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AppSlice {
    menuWindow: boolean
}

const initialState: AppSlice = {
    menuWindow: false
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        toggleMenu: (state) => {
            state.menuWindow = !state.menuWindow
        }
    }
})

export default appSlice.reducer

export const { toggleMenu } = appSlice.actions