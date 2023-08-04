import { ChangeEvent } from "react"
import { socket } from "../App"
import { matchedValueInArr } from "../customFunctions/isCoincidenceInArr"
import { SocketEmmits } from "../enums/SocketEnums"
import { UserModel } from "../models/UserModel"
import { activateChat } from "../slices/chatSlice"
import { useAppDispatch, useAppSelector } from "./hooks"
import { useStateController } from "./useStateController"
import { AsyncThunk } from "@reduxjs/toolkit"
import { openChatBar } from "../slices/appSlice"

type LogicFunc = (id: string) => void
type LogicFuncUser = (user: UserModel) => void

export const useLogic = () => {

    const dispatch = useAppDispatch()

    const currentUser = useAppSelector(state => state.currentUser.user)
    const users = useAppSelector(state => state.users.container)

    const {
        moveToSuggestation,
        removeFromSuggestation,
        removeFromInvitation,
        removeFromFriend,
        moveToFriend
    } = useStateController()

    const changeImage = (e: ChangeEvent<HTMLInputElement>, cb: AsyncThunk<string, {file: FormData}, any> ) => {
        const {name, files} = e.target
        const avatar = new FormData()
        files && avatar.append(name, files[0])
        dispatch(cb({file: avatar}))
    }


    const goToChat: (userId: string) => void = (userId) => {
        console.log(userId);
        dispatch(openChatBar(true))
        if(currentUser){
            const userChats = users.find((user) => user._id === userId)?.chats
            if (userChats) {
                const matchedChat = matchedValueInArr(currentUser.chats, userChats)
                if (matchedChat) {
                    dispatch(activateChat(matchedChat))
                } 
                else {
                    socket.emit<SocketEmmits>(SocketEmmits.CREATE_NEW_CHAT, {userReceiver: userId})
                }
            }
        }
    }

    const addFriend = (user: UserModel) => {
        moveToSuggestation({user})
        socket.emit<SocketEmmits>(SocketEmmits.NEW_INVITATION, {friendId: user._id})
    }

    const deleteFriend: LogicFunc = (userId) => {
        removeFromFriend({userId})
        socket.emit<SocketEmmits>(SocketEmmits.DELETE_FRIEND, {friendId: userId})
    }

    const acceptFriend: LogicFuncUser = (user) => {
        moveToFriend({user})
        socket.emit<SocketEmmits>(SocketEmmits.ACCEPT_INVITATION, {friendId: user._id})
    }

    const rejectFriend: LogicFunc = (userId) => {
        removeFromInvitation({userId})
        socket.emit<SocketEmmits>(SocketEmmits.REJECT_INVITATION, {friendId:userId})
    }

    const cancelSuggestation = (userId:string) => {
        removeFromSuggestation({userId})
        socket.emit<SocketEmmits>(SocketEmmits.CANCEL_SUGGESTATION, {friendId: userId})
    }

    return {
        addFriend,
        changeImage,
        goToChat,
        deleteFriend,
        acceptFriend,
        rejectFriend,
        cancelSuggestation
    }
}