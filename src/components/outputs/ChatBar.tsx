import {useState, useEffect} from 'react'
import { RoundButton } from '../UI/RoundButton'
import { BellIcon, ChevronLeftIcon} from '@heroicons/react/24/solid'
import { ChatItem } from './ChatItem'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { ContentBox } from '../UI/ContentBox'
import { URL } from '../../http'
import { socket } from '../../App'
import { decreaseCounter, activateChat, deactivateChat, setTypingStatus, getMyChats, chatOpen } from '../../slices/chatSlice'
import { createTempMessage, getMessages } from '../../slices/messagesSlice'
import { ChatHeader } from '../Layout/chat/ChatHeader'
import { nanoid } from '@reduxjs/toolkit'
import { ChatForm } from '../Layout/chat/ChatForm'
import { ChatContent } from '../Layout/chat/ChatContent'
import { SocketEmmits } from '../../enums/SocketEnums'
import { toggleChat } from '../../slices/appSlice'




export const ChatBar = () => {

    const text = 'No Chats, while'
    const dispatch = useAppDispatch()

    const {messageCounter} = useAppSelector(state => state.chats)
    const chats = useAppSelector(state => state.chats.container)
    const activeChat = chats.find(chat => chat.isActive)
    const messages = useAppSelector(state => state.messages.container)
    const currentUser = useAppSelector(state => state.currentUser.user)
    const isOpenChat = useAppSelector(state => state.chats.isOpenChatBar)


    useEffect (()=>{
        if(activeChat){
            dispatch(toggleChat())
        }
    },[activeChat?._id])
  
    useEffect (()=>{
        if(activeChat){
            dispatch(getMessages({chat: activeChat._id}))
        }
    },[activeChat?._id])

  



    const handlerOnVisible = (messageId: string, messageUser: string, isRead: boolean, chatId: string) => {
        if(currentUser && currentUser._id !== messageUser && !isRead){
            socket.emit<SocketEmmits>(SocketEmmits.READ_MESSAGE, {messageId, chatId})
            dispatch(decreaseCounter({chatId}))
        }
    }

    const handlerDeleteMessage = (messageId: string, chatId: string) => {
        socket.emit<SocketEmmits>(SocketEmmits.DELETE_MESSAGE, {messageId, chatId})
     }

    const handlerOnDeleteChat = () => {
        if(activeChat){
            socket.emit<SocketEmmits>(SocketEmmits.DELETE_CHAT, {chatId: activeChat._id})
        }
    }
    
    const handlerHideChat = () => {
        if(activeChat){
            dispatch(deactivateChat(activeChat._id))
        }
    }

    const handleOpenChat = (chatId: string) => {
        if(activeChat?._id === chatId){
            dispatch(deactivateChat(chatId))
        }
        else{
            dispatch(activateChat(chatId))
        }

    }

    const handleSubmit = (text: string) => {
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

    const headerStartTyping = () => {
        if(activeChat){
            socket.emit<SocketEmmits>(SocketEmmits.START_TYPING, {chatId: activeChat._id})
        }
    }

    const headerFinishTyping = () => {
        if(activeChat){
            socket.emit<SocketEmmits>(SocketEmmits.END_TYPING,  {chatId: activeChat._id})
        }
    }

    const activeChatUser = activeChat && activeChat.users[0]

  return (
    <div className={`bg-orange-200/90 z-20 py-12 fixed right-0 top-20 h-screen duration-300 shadow-light ${isOpenChat ? '':'translate-x-3/4'}`}>
        <RoundButton
            className={`absolute top-0  -translate-y-full -translate-x-1/2 ${isOpenChat ? 'rotate-180': ''}`}
            icon = {<ChevronLeftIcon/>}
            onClick={()=>dispatch(chatOpen(!isOpenChat))}
        />
        <ul className='flex flex-col items-center p-2'>
            {
                !!chats.length ?
                chats.map(chat => (
                    <ChatItem 
                        key ={chat._id}
                        chatId={chat._id}
                        isActive = {activeChat?._id === chat._id}
                        isTyping = {chat.isTyping}
                        src={chat.users[0].private.avatar}
                        isOnline ={chat.users[0].isOnline}
                        counter={chat.unreadMessageCount}
                        onClick={handleOpenChat}
                    />
                ))
                :
                Array.from(text).map((word, i) => (
                <li key={i} className='font-bold text-3xl text-sky-700 px-5'>{word}</li>
                ))
            }
        </ul>
        {
            activeChatUser && 
            <div className={`absolute top-2 left-0 -translate-x-[110%]  duration-300 `}>
                <ContentBox 
                    title='Chat'
                    className='min-w-[400px]'
                >
                <ChatHeader
                        isTyping = {activeChat.isTyping}
                        chatName={activeChatUser.private.firstName + ' ' + activeChatUser.private.lastName}
                        isOnline = {activeChatUser.isOnline}
                        avatar = {activeChatUser.private.avatar ? URL + activeChatUser.private.avatar : ''}
                        onHide={handlerHideChat}
                        onDelete={handlerOnDeleteChat}
                />
                
                {
                    currentUser &&
                    <ChatContent
                        isOpen = {isOpenChat}
                        messageCounter = {messageCounter}
                        currentUserId={currentUser._id}
                        content={messages}
                        onVisible={handlerOnVisible}
                        onDelete={handlerDeleteMessage}
                        onEdit={()=>{}}
                        offTyping={()=>{dispatch(setTypingStatus({chatId: activeChat._id, status: false }))}}
                    />
                }
                
                    <ChatForm
                        onSubmit = {handleSubmit}
                        onStartTyping = {headerStartTyping}
                        onFinishTyping = {headerFinishTyping}
                    />
                </ContentBox>
            </div>
        }
    </div>
  )
}
