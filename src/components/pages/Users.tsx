import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "../../hooks/hooks"
import type { UserModel } from "../../models/UserModel"
import { UserCard } from "../outputs/UserCard"
import { deleteUser } from "../../slices/currentUserSlice"
import { getUsers } from "../../slices/usersSlice"
import { matchedValueInArr } from "../../customFunctions/isCoincidenceInArr"
import { MappingBox } from "../UI/MappingBox"
import { RoundButton } from "../UI/RoundButton"
import {  ChatBubbleLeftRightIcon, UserMinusIcon, UserPlusIcon, XCircleIcon } from "@heroicons/react/24/solid"
import { ContentBox } from "../UI/ContentBox"
import { UserCardSkeleton } from "../Preloaders/UserCardSkeleton"
import { socket } from "../../App"
import { useStateController } from "../../hooks/useStateController"
import { activateChat } from "../../slices/chatSlice"
import { URL } from "../../http"
import { SocketEmmits } from "../../enums/SocketEnums"



export const Users = () => {

    const {
        moveToSuggestation,
        moveToFriend,
        removeFromFriend,
        removeFromSuggestation,
        removeFromInvitation,
    } = useStateController()

    const dispatch = useAppDispatch()
    const users = useAppSelector<UserModel[]>((state) => state.users.container)
    const isLoadingUsers = useAppSelector<boolean>((state) => state.users.isLoading)
    const isLoadingFriends = useAppSelector<boolean>((state) => state.friends.isLoading)
    const currentUser = useAppSelector<UserModel | null>((state) => state.currentUser.user)
    const isLoadingSuggest = useAppSelector<boolean>((state) => state.suggestations.isLoading)
    const isLoadingInvitations = useAppSelector<boolean>((state) => state.invitations.isLoading)

    useEffect(() => {
      dispatch(getUsers({}))
    }, [])

    const goToChat: (userId: string) => void = (userId) => {
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

    const handlerDelete = (id:string) => {
        dispatch(deleteUser())
    }
    
    const handlerAddToFriends = (user: UserModel) => {
        if(currentUser && !currentUser.myRequests.includes(user._id)) {
            moveToSuggestation({user})
            socket.emit<SocketEmmits>(SocketEmmits.NEW_INVITATION, {friendId: user._id})
        }
    }

    const handlerCancelSuggestation = (userId:string) => {
        if (currentUser && currentUser.myRequests.includes(userId)) {
            removeFromSuggestation({userId})
            socket.emit<SocketEmmits>(SocketEmmits.CANCEL_SUGGESTATION, {friendId: userId})
        }
        
    }
  
    const handlerReject = (userId:string) => {
        removeFromInvitation({userId})
        socket.emit<SocketEmmits>(SocketEmmits.REJECT_INVITATION, {friendId:userId})
    }
    
    
    const handlerAccept = (user:UserModel) => {
        moveToFriend({user})
        socket.emit<SocketEmmits>(SocketEmmits.ACCEPT_INVITATION, {friendId: user._id})

    }
  
    const handlerDeleteFromFriends = (userId:string) => {
        removeFromFriend({userId})
        socket.emit<SocketEmmits>(SocketEmmits.DELETE_FRIEND, {friendId: userId})
    }


  return (
    <ContentBox 
        title='People'
        className="grow"
    >
        <MappingBox 
            isLoading = {isLoadingUsers}
            isAlternate = {!users.length}
            loadingComponent = {<UserCardSkeleton/>}
            alternateComponent = 'Пока нет пользователей'
        >
            <ul className='grid justify-center grid-cols-1 justify-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-5 '>
                {
                    users.map(user => {
                        const {_id, isOnline, picture, friends, posts} = user
                        const {avatar, firstName, lastName} = user.private
                        const isI = currentUser?._id === user._id 
                        const isMyRequest = (currentUser?.myRequests.includes(user._id))
                        const isMyFriend = currentUser?.friends.includes(user._id)
                        const isMyInvitation = currentUser?.invitations.includes(user._id )
                        return (
                            <UserCard 
                                key={_id}
                                id={_id}
                                isOnline={isOnline}
                                avatar={avatar && URL + avatar}
                                picture={picture && URL + picture}
                                lastName={lastName}
                                firstName={firstName}
                                friendCounter={friends.length}
                                postCounter={posts.length}
                            >
                                { 
                                currentUser &&
                                <>
                                    {
                                        !isI && !(isMyFriend || isMyInvitation || isMyRequest) &&
                                        <RoundButton 
                                            title='Пригласить в друзья' 
                                            isLoading = {isLoadingSuggest}
                                            icon = {<UserPlusIcon className='text-white'/>}
                                            onClick={() => handlerAddToFriends(user)}  
                                        />
                                    }
                                    {
                                        !isI && isMyRequest &&
                                        <RoundButton 
                                            title='Отозвать приглашение'  
                                            isLoading = {isLoadingSuggest}
                                            icon = {<UserMinusIcon />}
                                            onClick={() => handlerCancelSuggestation(user._id)}  
                                        />
                                    }
                                    {
                                        isMyInvitation &&
                                        <>  
                                            <RoundButton 
                                                title='Принять приглашение'
                                                isLoading={isLoadingInvitations}
                                                icon = {<UserPlusIcon />}
                                                onClick={()=>handlerAccept(user)}   
                                            />
                                            <RoundButton 
                                                title='Отклонить приглашение' 
                                                isLoading={isLoadingInvitations}
                                                icon = {<UserMinusIcon />}
                                                onClick={() => handlerReject(user._id)}     
                                            />
                                        </>
                                    }
                                    {
                                        isMyFriend &&
                                        <RoundButton 
                                            title='Удалить из друзей'  
                                            isLoading = {isLoadingFriends}
                                            icon = {<UserMinusIcon />}
                                            onClick={() =>  handlerDeleteFromFriends(user._id)}       
                                        />
                                    }

                                    {
                                        !isI &&
                                        <RoundButton 
                                            title='Написать сообщение' 
                                            icon = {<ChatBubbleLeftRightIcon />} 
                                            onClick={()=>goToChat(user._id)}
                                        />
                                    }
                                </>
                                }
                                {
                                    
                                    user.contacts.email !== 'guest@guest' && currentUser && currentUser._id === _id &&
                                    <RoundButton 
                                        title='Удалить пользователя'  
                                        icon = {<XCircleIcon />}
                                        onClick={()=>handlerDelete(user._id)}      
                                    />
                                }
                            </UserCard>
                        )
                    })
                }
            </ul>
        </MappingBox>
    </ContentBox>
)
}
