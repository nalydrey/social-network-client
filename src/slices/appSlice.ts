import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AppSlice {
    isOpenChatBar: boolean
}

const initialState: AppSlice = {
    isOpenChatBar: false,
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        openChatBar: (state, action: PayloadAction<boolean>) => {
            state.isOpenChatBar = action.payload
        }
    }
})

export default appSlice.reducer

export const { openChatBar } = appSlice.actions