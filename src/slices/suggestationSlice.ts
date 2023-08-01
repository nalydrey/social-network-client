import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Slice } from "../models/Slice";
import { UserModel } from "../models/UserModel";
import axios from "../axios";
import { queryString } from "../customFunctions/queryString";
import { Endpoints } from "../enums/Endpoints";


const initialState: Slice<UserModel> = {
    container: [],
    isLoading: false
}

export const getSuggestations = createAsyncThunk(
    'suggestations/getSuggestations',
    async (suggestations: string[]) => {
        if(suggestations.length){
            const query = queryString({_id: suggestations})
            const {data} = await axios.get<{users: UserModel[]}>(`${Endpoints.USERS}?${query}`)
            return data
        }
        return {users: []}
    }
)


export const suggestationSlice = createSlice({
    name: 'suggestations',
    initialState,
    reducers: {
        addMyRequest: (state, action: PayloadAction<UserModel>) => {
            state.container.push(action.payload)
        },
        deleteMyRequest: (state, action: PayloadAction<{userId: string}>) => {
            state.container = state.container.filter(user => user._id !== action.payload.userId)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSuggestations.fulfilled, (state, action) => {
                state.container = action.payload.users
            })
    }
})

export default suggestationSlice.reducer

export const {addMyRequest, deleteMyRequest} = suggestationSlice.actions