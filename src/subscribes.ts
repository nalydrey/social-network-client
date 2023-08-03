import { socket } from "./App"
import { addCreatedChat, chatUserConnect, chatUserDisconnect, deleteChat, setTypingStatus } from "./slices/chatSlice"
import { createMessage, deleteMessage, readMessage } from "./slices/messagesSlice"
import { connectUser, disconnectUser } from "./slices/usersSlice"
import type { AppDispatch } from "./store/store"
import type { MessageModel } from "./models/MessageModel"
import type { UserModel } from "./models/UserModel"
import { StateControllerReturn } from "./hooks/useStateController"
import { SocketEmmits, SocketEvents } from "./enums/SocketEnums"

type SubscribesFunc = (dispatch: AppDispatch, currentUser: UserModel, controller: StateControllerReturn ) => void 


export const subscribes: SubscribesFunc = (dispatch, currentUser, controller) => {

    const {
        moveToInvitation,
        removeFromInvitation,
        removeFromSuggestation,
        moveToFriend,
        removeFromFriend
        } = controller

    socket.emit<SocketEmmits>(SocketEmmits.ENTER_USER, {userId: currentUser._id})
    socket.emit<SocketEmmits>( SocketEmmits.CONNECT_CHATS, {chats: currentUser.chats})

    socket.on<SocketEvents>(SocketEvents.USER_CONNECTED, (data) => {
        dispatch(connectUser({userId: data.user }))
        dispatch(chatUserConnect({user: data.user}))

    })
    socket.on<SocketEvents>(SocketEvents.USER_DISCONNECTED, (data) => {
        dispatch(disconnectUser({userId: data.user}))
        dispatch(chatUserDisconnect({user: data.user}))
    })
    socket.on<SocketEvents>(SocketEvents.MESSAGE_IS_CREATED, (data: MessageModel) => {
        dispatch(createMessage(data))
    })
    socket.on<SocketEvents>(SocketEvents.CHAT_IS_CREATED, (data) => {
        dispatch(addCreatedChat({...data, currentUserId: currentUser._id}))
    })
    socket.on<SocketEvents>(SocketEvents.MESSAGE_IS_READ, (data) => {
        dispatch(readMessage({messageId: data}))
    })
    socket.on<SocketEvents>(SocketEvents.MESSAGE_IS_DELETED, (message: MessageModel)=>{
        dispatch(deleteMessage({message, currentUserId: currentUser._id}))
    })
    socket.on<SocketEvents>(SocketEvents.CHAT_IS_DELETED, (chatId: string)=>{
        dispatch(deleteChat(chatId))
    })
    socket.on<SocketEvents>(SocketEvents.TYPING_STARTED, (chatId: string)=>{
        dispatch(setTypingStatus({chatId, status: true}))
    })
    socket.on<SocketEvents>(SocketEvents.TYPING_FINISHED, (chatId: string)=>{
        dispatch(setTypingStatus({chatId, status: false}))
        
    })


    socket.on<SocketEvents>(SocketEvents.USER_IS_INVITED, moveToInvitation)
    socket.on<SocketEvents>(SocketEvents.SUGGESTATION_IS_CANCELED, removeFromInvitation)
    socket.on<SocketEvents>(SocketEvents.INVITATION_IS_REJECTED, removeFromSuggestation)
    socket.on<SocketEvents>(SocketEvents.INVITATION_IS_ACCEPTED, moveToFriend)
    socket.on<SocketEvents>(SocketEvents.FRIEND_IS_DELETED, removeFromFriend)


}

export const unsubscribe = () => {

    socket.off<SocketEvents>(SocketEvents.USER_CONNECTED)
    socket.off<SocketEvents>(SocketEvents.USER_DISCONNECTED)
    socket.off<SocketEvents>(SocketEvents.MESSAGE_IS_CREATED)
    socket.off<SocketEvents>(SocketEvents.CHAT_IS_CREATED)
    socket.off<SocketEvents>(SocketEvents.MESSAGE_IS_READ)
    socket.off<SocketEvents>(SocketEvents.MESSAGE_IS_DELETED)
    socket.off<SocketEvents>(SocketEvents.CHAT_IS_DELETED)
}