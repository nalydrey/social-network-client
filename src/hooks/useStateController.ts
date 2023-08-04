import { UserModel } from "../models/UserModel"
import { addFriendToCurrentUser, addInvitationToCurrentUser, addSuggestationToCurrentUser, deleteChatFromCurrentUser, deleteFriendFromCurrentUser, deleteInvitationFromCurrentUser, deleteSuggestationFromCurrentUser } from "../slices/currentUserSlice"
import { addUserToFriends, deleteFromFriends } from "../slices/friendSlice"
import { deleteFriendFromUsers } from "../slices/usersSlice"
import { useAppDispatch, useAppSelector } from "./hooks"
import { addMyRequest, deleteMyRequest } from "../slices/suggestationSlice"
import { addToInvitation, deleteFromInvitation } from "../slices/invitationSlice"
import { removeChat } from "../slices/chatSlice"


type UserParam = ({user}: {user: UserModel}) => void
type StringParam = ({userId}: {userId: string}) => void
type ChatParam = ({chatId}: {chatId: string}) => void

export interface StateControllerReturn {
    // deleteFriend: StringParam
    // acceptInvitation: UserParam
    deleteChat: ChatParam
    moveToFriend: UserParam
    moveToSuggestation: UserParam 
    moveToInvitation: UserParam 
    removeFromSuggestation: StringParam
    removeFromInvitation: StringParam
    removeFromFriend: StringParam


}
export type StateController = () => StateControllerReturn

export const useStateController: StateController = ( ) => {

    const dispatch = useAppDispatch()
    const currentUser = useAppSelector<UserModel | null>(state => state.currentUser.user)
   
    const moveToSuggestation: UserParam = ({user}) => {
        if(currentUser){
            dispatch(addSuggestationToCurrentUser({friendId: user._id}))
            dispatch(addMyRequest(user))
        }
    }
 
    const moveToInvitation: UserParam = ({user}) => {
        if(currentUser){
            dispatch(addInvitationToCurrentUser({friendId: user._id}))
            dispatch(addToInvitation(user))
        }
    }

    const removeFromSuggestation: StringParam = ({userId}) => {
        if(currentUser){
            dispatch(deleteSuggestationFromCurrentUser({friendId: userId}))
            dispatch(deleteMyRequest({userId}))
        }
    }
   
    const removeFromInvitation: StringParam = ({userId}) => {
        if(currentUser){
            dispatch( deleteInvitationFromCurrentUser({friendId: userId}))
            dispatch( deleteFromInvitation({userId}))
        }
    }

    const moveToFriend: UserParam = ({user}) => {
        if(currentUser){
            dispatch(addFriendToCurrentUser({friendId: user._id}))
            dispatch(addUserToFriends({user}))
            removeFromSuggestation({userId: user._id})
            removeFromInvitation({userId: user._id})
        }
    }

    const removeFromFriend: StringParam = ({userId}) => {
        if(currentUser){
            dispatch(deleteFromFriends({userId}))
            dispatch(deleteFriendFromCurrentUser({friendId: userId}))
            dispatch(deleteFriendFromUsers({friendId: userId, userId: currentUser._id}))
            dispatch(deleteFriendFromUsers({friendId: currentUser._id, userId: userId}))
        }
    }

    const deleteChat: ChatParam = ({chatId}) => {
        dispatch(deleteChatFromCurrentUser({chatId}))
        dispatch(removeChat({chatId}))
    }

    return {
        deleteChat,
        moveToSuggestation,
        moveToInvitation,
        removeFromSuggestation,
        removeFromInvitation,
        moveToFriend,
        removeFromFriend,
    }
}