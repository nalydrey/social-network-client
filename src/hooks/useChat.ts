import { useEffect } from 'react'
import { nanoid } from "@reduxjs/toolkit"
import { socket } from "../App"
import { SocketEmmits } from "../enums/SocketEnums"
import { activateChat, deactivateChat, decreaseCounter } from "../slices/chatSlice"
import { createTempMessage, getMessages } from "../slices/messagesSlice"
import { useAppDispatch, useAppSelector } from "./hooks"

export const useChat = () => {

    const dispatch = useAppDispatch()
    const currentUser = useAppSelector(state => state.currentUser.user)
    const {messageCounter} = useAppSelector(state => state.chats)
    const chats = useAppSelector(state => state.chats.container)
    const messages = useAppSelector(state => state.messages.container)
    const activeChat = chats.find(chat => chat.isActive)
    
    

    useEffect (()=>{
        if(activeChat){
            dispatch(getMessages({chat: activeChat._id}))
        }
    },[activeChat?._id])


    const readMessage = (messageId: string, messageUser: string, isRead: boolean, chatId: string) => {
        if(currentUser && currentUser._id !== messageUser && !isRead){
            socket.emit<SocketEmmits>(SocketEmmits.READ_MESSAGE, {messageId, chatId})
            dispatch(decreaseCounter({chatId}))
        }
    }

    const deleteMessage = (messageId: string, chatId: string) => {
        socket.emit<SocketEmmits>(SocketEmmits.DELETE_MESSAGE, {messageId, chatId})
     }

    const deleteChat = () => {
        if(activeChat){
            socket.emit<SocketEmmits>(SocketEmmits.DELETE_CHAT, {chatId: activeChat._id})
        }
    }

    const startTyping = () => {
        if(activeChat){
            socket.emit<SocketEmmits>(SocketEmmits.START_TYPING, {chatId: activeChat._id})
        }
    }

    const finishTyping = () => {
        if(activeChat){
            socket.emit<SocketEmmits>(SocketEmmits.END_TYPING,  {chatId: activeChat._id})
        }
    }

    const closeChat = () => {
        if(activeChat){
            dispatch(deactivateChat(activeChat._id))
        }
    }

    const openChat = (chatId: string) => {
        if(activeChat?._id === chatId){
            dispatch(deactivateChat(chatId))
        }
        else{
            dispatch(activateChat(chatId))
        }
    }

    const sendMessage = (text: string) => {
        if(currentUser && activeChat){
            const createdId = nanoid()
            const date = new Date().toISOString()
            
            dispatch(createTempMessage({
                _id: 'temp', 
                createdId,
                user: currentUser,
                chat: activeChat._id,
                isRead: false,
                text,
                createdAt: date,
                updatedAt: date,
            }))

            socket.emit<SocketEmmits>(SocketEmmits.SEND_MESSAGE, {
                createdId,
                user: currentUser._id, 
                chat: activeChat._id, 
                text
            })
        }
    }

    const activeChatUser = activeChat && activeChat.users[0]

    return {
        chats,
        activeChat,
        activeChatUser,
        currentUser,
        messages,
        messageCounter,
        readMessage,
        deleteMessage,
        deleteChat,
        sendMessage,
        startTyping,
        finishTyping,
        closeChat,
        openChat
    }
}