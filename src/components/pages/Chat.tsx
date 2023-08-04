import React from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { useChat } from '../../hooks/useChat'
import { ContentBox } from '../UI/ContentBox'
import { ChatHeader } from '../Layout/chat/ChatHeader'
import { ChatContent } from '../Layout/chat/ChatContent'
import { ChatForm } from '../Layout/chat/ChatForm'
import { setTypingStatus } from '../../slices/chatSlice'
import { ChatItem } from '../outputs/ChatItem'

export const Chat = () => {

    const dispatch = useAppDispatch()

    const {isOpenChatBar} = useAppSelector(state => state.app)

    const {
        chats,
        messages,
        activeChat,
        currentUser,
        activeChatUser,
        messageCounter,
        openChat,
        closeChat,
        deleteChat,
        sendMessage,
        readMessage,
        startTyping,
        finishTyping,
        deleteMessage,
    } = useChat()



  return (
    <ContentBox 
        title='Chat'
        className='min-w-[400px]'
    >
        <ul className='flex items-center gap-5 p-2 border-b-4 border-sky-700'>
            {
                chats.map(chat => (
                    <ChatItem 
                        key ={chat._id}
                        chatId={chat._id}
                        isActive = {activeChat?._id === chat._id}
                        isTyping = {chat.isTyping}
                        src={chat.users[0].private.avatar}
                        isOnline ={chat.users[0].isOnline}
                        counter={chat.unreadMessageCount}
                        onClick={openChat}
                    />
                ))
            }
        </ul>
        {
                activeChat && activeChatUser && 
            <>
                <ChatHeader
                        isTyping = {activeChat.isTyping}
                        chatName={activeChatUser.private.firstName + ' ' + activeChatUser.private.lastName}
                        isOnline = {activeChatUser.isOnline}
                        avatar = {activeChatUser.private.avatar ? URL + activeChatUser.private.avatar : ''}
                        onHide={closeChat}
                        onDelete={deleteChat}
                />
                
                {
                    currentUser &&
                    <ChatContent
                        isOpen = {isOpenChatBar}
                        messageCounter = {messageCounter}
                        currentUserId={currentUser._id}
                        content={messages}
                        onVisible={readMessage}
                        onDelete={deleteMessage}
                        onEdit={()=>{}}
                        offTyping={()=>{dispatch(setTypingStatus({chatId: activeChat._id, status: false }))}}
                    />
                }
                    <ChatForm
                        onSubmit = {sendMessage}
                        onStartTyping = {startTyping}
                        onFinishTyping = {finishTyping}
                    />
            </>
        }
    </ContentBox>
  )
}
