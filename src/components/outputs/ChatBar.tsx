import { RoundButton } from '../UI/RoundButton'
import { ChevronLeftIcon} from '@heroicons/react/24/solid'
import { ChatItem } from './ChatItem'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { ContentBox } from '../UI/ContentBox'
import { URL } from '../../http'
import { setTypingStatus } from '../../slices/chatSlice'
import { ChatHeader } from '../Layout/chat/ChatHeader'
import { ChatForm } from '../Layout/chat/ChatForm'
import { ChatContent } from '../Layout/chat/ChatContent'
import { useChat } from '../../hooks/useChat'
import { openChatBar } from '../../slices/appSlice'




export const ChatBar = () => {

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
    <div className={`${chats.length ? '': 'hidden'} hidden md:block bg-orange-200/90 z-20 py-12 fixed right-0 top-20 h-screen duration-300 shadow-light ${isOpenChatBar ? '':'translate-x-3/4'}`}>
        <RoundButton
            className={`absolute top-0  -translate-y-full -translate-x-1/2 ${isOpenChatBar ? 'rotate-180': ''}`}
            icon = {<ChevronLeftIcon/>}
            onClick={()=>dispatch(openChatBar(!isOpenChatBar))}
        />
        <ul className='flex flex-col items-center p-2'>
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
                </ContentBox>
            </div>
        }
    </div>
  )
}
