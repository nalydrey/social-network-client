import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
    info: ''
}

export const infoSlice = createSlice({
        name: 'info',
        initialState,
        reducers: {
            setInfo: (state, action: PayloadAction<string>) => {
                state.info = action.payload
            }
        }
    }
)

export default infoSlice.reducer
export const {setInfo} = infoSlice.actions