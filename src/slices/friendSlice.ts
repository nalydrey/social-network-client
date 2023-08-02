import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Slice } from '../models/Slice'
import { UserModel } from "../models/UserModel"
import axios from '../axios'
import { queryString } from '../customFunctions/queryString'
import { Endpoints } from '../enums/Endpoints'
import { RootState } from '../store/store'


const initialState: Slice<UserModel> = {
    container: [],
    isLoading: false
}

export const getFriends = createAsyncThunk(
    'friends/getFriends',
    async (friends: string[]) => {
        if(friends.length){
            const query = queryString({_id: friends})
            const {data} = await axios.get<{users: UserModel[]}>(`${Endpoints.USERS}?${query}`) 
            return {friends: data.users}
        }
        return {friends: []}
    }
) 

export const friendSlice = createSlice({
    name: 'friends',
    initialState,
    reducers: {
        addUserToFriends: (state, action: PayloadAction<{user: UserModel}>) => {
            state.container.push(action.payload.user)
        },
        deleteFromFriends: (state, action: PayloadAction<{userId: string }>) => {
            state.container = state.container.filter(user => user._id !== action.payload.userId)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFriends.fulfilled, (state, action) => {
                state.container = action.payload.friends
            })
    }
}) 

export default friendSlice.reducer

export const {addUserToFriends, deleteFromFriends} = friendSlice.actions