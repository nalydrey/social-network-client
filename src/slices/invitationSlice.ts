import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Slice } from "../models/Slice";
import { UserModel } from "../models/UserModel";
import axios from "../axios";
import { queryString } from "../customFunctions/queryString";
import { Endpoints } from "../enums/Endpoints";


const initialState: Slice<UserModel>= {
    container: [],
    isLoading: false 
}

export const getInvitations = createAsyncThunk(
    'invitations/getInvitations',
    async (invitations: string[]) => {
        if(invitations.length){
            const query = queryString({_id: invitations})
            const {data} = await axios.get<{users: UserModel[]}>(`${Endpoints.USERS}?${query}`)
            return data
        }
        return {users: []}
    }
)

export const invitationSlice = createSlice({
    name: 'invitations',
    initialState,
    reducers: {
        addToInvitation: (state, action: PayloadAction<UserModel>) => {
            state.container.push(action.payload)
        },
        deleteFromInvitation: (state, action: PayloadAction<{userId: string}>) => {
            state.container = state.container.filter(user => user._id !== action.payload.userId)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getInvitations.fulfilled, (state, action) => {
                state.container = action.payload.users
            })
    }
})

export const {addToInvitation, deleteFromInvitation} = invitationSlice.actions

export default invitationSlice.reducer