import { socket } from "../App"
import { SocketEmmits } from "../enums/SocketEnums"
import { UserModel } from "../models/UserModel"
import { useStateController } from "./useStateController"

type LogicFunc = (id: string) => void
type LogicFuncUser = (user: UserModel) => void

export const useLogic = () => {

    const {
        removeFromInvitation,
        removeFromFriend,
        moveToFriend
    } = useStateController()


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

    return {
        deleteFriend,
        acceptFriend,
        rejectFriend
    }
}