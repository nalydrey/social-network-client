import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit"
import { UserModel } from "../models/UserModel"
import axios from '../axios'
import { Slice } from "../models/Slice"
import { isPayload, QueryPayload, queryString } from "../customFunctions/queryString"
import { Endpoints } from "../enums/Endpoints"



    const initialState: Slice<UserModel>= {
        container: [],
        isLoading: false,
    }

    export const getUsers = createAsyncThunk(
      "users/getUsers",
      async (payload: QueryPayload = {}) => {
        if(isPayload(payload)){
          const query = queryString(payload)
          const {data} = await axios.get<{users: UserModel[]}>(`${Endpoints.USERS}?${query}`)
          return {users: data.users}
        }
          return {users: []}
        } 
    )


const users = createSlice({
  name: "users",
  initialState,
  reducers: {
    connectUser: (state, action: PayloadAction<{userId: string}>) => {
      const user = state.container.find(user => user._id === action.payload.userId)
      if(user) {
        user.isOnline = true
      }
    },
    disconnectUser: (state, action: PayloadAction<{userId: string}>) => {
      const user = state.container.find(user => user._id === action.payload.userId)
      if(user) {
        user.isOnline = false
      }
    },
    addFriendToUsers: (state, action: PayloadAction<{friendId: string, userId: string}>) => {
      state.container.forEach(user => {
        if(user._id === action.payload.userId) user.friends.push(action.payload.friendId) 
      })
    },
    deleteFriendFromUsers: (state, action: PayloadAction<{friendId: string, userId: string}>) => {
      state.container.forEach(user => {
        if(user._id === action.payload.userId) 
        user.friends = user.friends.filter(friendId => friendId !== action.payload.friendId)
      })
    },
    addChat: (
      state,
      action: PayloadAction<{ usersIds: string[]; chatId: string }>,
    ) => {
      action.payload.usersIds.forEach((userId) => {
        state.container.find((user) => user._id === userId)
          ?.chats.push(action.payload.chatId)
      })
    },
    deleteFromUsers: (state, action: PayloadAction<string>) => {
      state.container = state.container.filter((user) => user._id !== action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.container = action.payload.users
        state.isLoading = false
      })
  },
})

export default users.reducer

export const { addChat, deleteFriendFromUsers, addFriendToUsers, connectUser, disconnectUser } = users.actions
