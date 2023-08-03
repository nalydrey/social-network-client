import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AppSlice {
    menuWindow: boolean
    isOpenChat: boolean
}

const initialState: AppSlice = {
    menuWindow: false,
    isOpenChat: false
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        toggleMenu: (state) => {
            state.menuWindow = !state.menuWindow
        },
        toggleChat: (state) => {
            state.isOpenChat = !state.isOpenChat
        }
    }
})

export default appSlice.reducer

export const { toggleMenu, toggleChat } = appSlice.actions