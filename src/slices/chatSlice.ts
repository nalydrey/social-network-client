import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { ChatModel } from "../models/ChatModel"
import type { MessageModel } from "../models/MessageModel"
import type { Slice } from "../models/Slice"
import axios from '../axios'
import { addMyChat, deleteChatFromCurrentUser } from "./currentUserSlice"
import { addChat } from "./usersSlice"
import { socket } from "../App"
import { Endpoints } from "../enums/Endpoints"


    export interface Chat extends Slice<ChatModel> {
        isActive: boolean
        error: string
        messageCounter: number
    }

    const initialState: Chat = {
        container: [],
        messageCounter: 0,
        isLoading: false,
        isActive: false,
        error: ''
    }


  export const getMyChats = createAsyncThunk(
      "chats/getMyChats",
      async (currentUserId: string ) => {
          //Получаем свои чаты
          const {data} = await axios.get<{chats: ChatModel[]}>(`${Endpoints.CHATS}/my`) 
          //удалить текущего потьзователя из чата
          let counter = 0
          data.chats.forEach(chat => {
              chat.users = chat.users.filter(user => user._id !==currentUserId);
              chat.isActive = false
              counter = counter + chat.unreadMessageCount
          })
          return {chats: data.chats, counter}
      },
  )


  export const addCreatedChat = createAsyncThunk(
    'chats/addCreatedChat',
    ({chat, currentUserId}: {chat: ChatModel, currentUserId: string}, {dispatch} ) => {
      console.log('payload ');
      //Присоединить пользователя к чату
      socket.emit('joinToChat',{chatId: chat._id})
      //Добавить пользователям
      dispatch(addMyChat(chat._id))
      dispatch(addChat({usersIds: chat.users.map(user => user._id), chatId: chat._id}))
      dispatch(deactivateChat(''))
      const creator = chat.users[0]._id
      chat.users = chat.users.filter(user => user._id !== currentUserId);
      console.log(creator, currentUserId);
      if(currentUserId === creator){
        chat.isActive = true
      }
      return {chat}
    }
  )

export const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    decreaseCounter: (state, action: PayloadAction<{chatId: string}>) => {
      const chat = state.container.find(chat => chat._id === action.payload.chatId)
      if (chat){
        chat.unreadMessageCount--
        state.messageCounter--
      } 
    },
    increaseCounter: (state, action: PayloadAction<{chatId: string}>) => {
      const chat = state.container.find(chat => chat._id === action.payload.chatId)
      if (chat){
        chat.unreadMessageCount++
        state.messageCounter++
      } 
    },
    removeChat: (state, action: PayloadAction<{chatId: string}>) => {
      const count = state.container.find(chat => chat._id === action.payload.chatId)?.unreadMessageCount || 0
      state.messageCounter = state.messageCounter - count
      state.container = state.container.filter(chat => chat._id !== action.payload.chatId)
    },
    activateChat: (state, action: PayloadAction<string>) => {
      state.container.forEach((chat) => {
        chat._id === action.payload
          ? (chat.isActive = true)
          : (chat.isActive = false)
      })
    },
    deactivateChat: (state, action: PayloadAction<string>) => {
      state.container.forEach(chat => chat.isActive = false)
    },
    setTypingStatus: (state, action: PayloadAction<{chatId: string, status: boolean}>) => {
      const chat = state.container.find(chat => chat._id === action.payload.chatId)
      if(chat){
        chat.isTyping = action.payload.status
      }
    },

    chatUserConnect: (state, action: PayloadAction<{user: string}>) => {
      const chat = state.container.find(chat => chat.users[0]._id === action.payload.user)
      if(chat){
        chat.users[0].isOnline = true
      }
    },
    
    chatUserDisconnect: (state, action: PayloadAction<{user: string}>) => {
      const chat = state.container.find(chat => chat.users[0]._id === action.payload.user)
      if(chat){
        chat.users[0].isOnline = false
      }
    },

    disactivateChat: (state) => {
      state.container.forEach(chat => chat.isActive = false)
    },
    addMessageToChat: (state, action: PayloadAction<{chat: ChatModel['_id'], message: MessageModel['_id']}>) => {
      state.container.forEach(chat => {
        chat._id === action.payload.chat && chat.messages.push(action.payload.message)
      })
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getMyChats.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getMyChats.fulfilled, (state, action) => {
        state.isLoading = false
        state.container = action.payload.chats
        state.messageCounter = action.payload.counter
      })
      .addCase(addCreatedChat.fulfilled, (state, action) => {
        state.container.push(action.payload.chat)
      })

  },
})

export default chatSlice.reducer

export const { 
  activateChat,
  deactivateChat,
  addMessageToChat,
  disactivateChat,
  decreaseCounter,
  removeChat,
  increaseCounter,
  chatUserConnect,
  chatUserDisconnect,
  setTypingStatus,
} = chatSlice.actions
