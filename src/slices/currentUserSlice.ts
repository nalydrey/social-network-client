import axios from '../axios'
import { UserModel } from "../models/UserModel"
import { EditUserForm } from "../components/pages/Profile"
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RegisterFormNames } from "../components/Forms/Register"
import { setInfo } from "./infoSlice"
import { LocalStorageNames } from "../enums/LocalStorageEnums"
import { Endpoints } from '../enums/Endpoints'
import { LoginFormNames } from '../components/Forms/Login'
import { socket } from '../App'
import { SocketEmmits } from '../enums/SocketEnums'

export type CurrentUserState = {
  user: UserModel | null,
  loadings: {[key: string]: boolean},
}

const initialState: CurrentUserState = {
  user: null,
  loadings: {
    isLoadingAvatar: false,
    isLoadingPicture: false
  },
} 

export const enter = createAsyncThunk(
  "currentUser/enter", 
  async () => {
  console.log('enter');
    const {data} = await axios<{user: UserModel | null, info: string}>(Endpoints.USER)
    console.log(data.user);
    if(!data.user){
      data.user = null
    }  
    return data.user
})

 export const createUser = createAsyncThunk(
  "currentUser/createUser",
  async (newUser : RegisterFormNames, {dispatch}) => {
      const {data} = await axios.post<{user: UserModel | null, token: string, info: string}>(Endpoints.USER, newUser)
      if(data.user){
        localStorage.setItem(LocalStorageNames.TOKEN, data.token)
      } 
        dispatch(setInfo(data.info))

      return {user: data.user}
  },
  )
 
  export const loginUser = createAsyncThunk(
  "currentUser/loginUser",
  async (loginData : LoginFormNames, {dispatch}) => {
      const {data} = await axios.post<{user: UserModel | null, token: string, info: string}>(Endpoints.USER_LOGIN, loginData)
      if(data.user){
        localStorage.setItem(LocalStorageNames.TOKEN, data.token)
      } 
      else{
        dispatch(setInfo(data.info))
        data.user = null
      }

      return {user: data.user}
  },
  )

  export const editUser = createAsyncThunk(
  "currentUser/editUser",
  async (editForm: EditUserForm) => {
    console.log('edit');
    
      const {data} = await axios.put(Endpoints.USER, editForm)
      return {user: data.user}
  },
  )

export const changeMyAvatar = createAsyncThunk(
  "currentUser/changeMyAvatar",
  async({file}: {file: FormData}) => {
    const {data}: {data: {avatar: string}} = await axios.put(Endpoints.USER_IMG, file)
    return data.avatar
  }
)

export const changeMyPicture = createAsyncThunk(
  "currentUser/changeMyPicture",
  async({file}: {file: FormData}) => {
    const {data}: {data: {picture: string}} = await axios.put(Endpoints.USER_PICTURE, file)
    return data.picture
  }
)

export const deleteUser = createAsyncThunk(
  "currentUser/deleteUser",
  async (_ , {dispatch}) => {
      const {data} = await axios.delete<{user: UserModel}>(Endpoints.USER)
      localStorage.removeItem(LocalStorageNames.TOKEN)
      console.log(data);
      return
  },
)






export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    quit: {
      reducer: (state) => {
        state.user = null
      },
      prepare: () => {
        localStorage.removeItem(LocalStorageNames.TOKEN)
        socket.emit<SocketEmmits>(SocketEmmits.QUIT_USER)
        return {payload: null}
      }
    },
    addMyChat: (state, action: PayloadAction<string>) => {
      if(state.user) 
      state.user.chats.push(action.payload)
    },
    addSuggestationToCurrentUser: (state, action: PayloadAction<{friendId: string}>) => {
      if(state.user)
      state.user.myRequests.push(action.payload.friendId)
    },
    addInvitationToCurrentUser: (state, action: PayloadAction<{friendId: string}>) => {
      if(state.user)
      state.user.invitations.push(action.payload.friendId)
    },
    deleteSuggestationFromCurrentUser: (state, action: PayloadAction<{friendId: string}>) => {
      if(state.user)
      state.user.myRequests = state.user.myRequests.filter(userId => userId !== action.payload.friendId)
    },
    deleteInvitationFromCurrentUser: (state, action: PayloadAction<{friendId: string}>) => {
      if(state.user)
      state.user.invitations = state.user.invitations.filter(userId => userId !== action.payload.friendId)
    },
    addFriendToCurrentUser: (state, action: PayloadAction<{friendId: string}>) => {
      if(state.user)
      state.user.friends.push(action.payload.friendId)
    },
    deleteFriendFromCurrentUser: (state, action: PayloadAction<{friendId: string}>) => {
      if(state.user)
      state.user.friends = state.user.friends.filter(userId => userId !== action.payload.friendId)
    },
    deleteChatFromCurrentUser: (state, action: PayloadAction<{chatId: string}>) => {
      if(state.user)
      state.user.chats = state.user.chats.filter(chatId => chatId !== action.payload.chatId)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(enter.fulfilled, (state, action) =>{
        state.user = action.payload
        state.loadings.isLoadingAvatar = false
      })
      .addCase(changeMyAvatar.pending, (state, action) =>{
        state.loadings.isLoadingAvatar = true
      })
      .addCase(changeMyAvatar.fulfilled, (state, action) =>{
        if(state.user)
          state.user.private.avatar = action.payload
          state.loadings.isLoadingAvatar = false

      })
      .addCase(changeMyPicture.pending, (state, action) =>{
        state.loadings.isLoadingPicture = true
      })
      .addCase(changeMyPicture.fulfilled, (state, action) =>{
        if(state.user)
          state.user.picture = action.payload
          state.loadings.isLoadingPicture = false
      })
      .addCase(createUser.fulfilled, (state, action) =>{
        state.user = action.payload.user
      })
      .addCase(loginUser.fulfilled, (state, action) =>{
        state.user = action.payload.user
      })
      .addCase(editUser.fulfilled, (state, action) =>{
        state.user = action.payload.user
      })
      .addCase(deleteUser.fulfilled, (state, action) =>{
        state.user = null
      })
  },
})

export const { 
  addMyChat, 
  addFriendToCurrentUser, 
  addSuggestationToCurrentUser, 
  addInvitationToCurrentUser,
  deleteFriendFromCurrentUser,
  deleteInvitationFromCurrentUser,
  deleteSuggestationFromCurrentUser,
  deleteChatFromCurrentUser,
  quit
 } = currentUserSlice.actions

export default currentUserSlice.reducer
