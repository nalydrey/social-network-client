import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "../../hooks/hooks"
import { UserCard } from "../outputs/UserCard"
import { deleteUser } from "../../slices/currentUserSlice"
import { getUsers } from "../../slices/usersSlice"
import { MappingBox } from "../UI/MappingBox"
import { RoundButton } from "../UI/RoundButton"
import { ChatBubbleLeftRightIcon, UserMinusIcon, UserPlusIcon, XCircleIcon } from "@heroicons/react/24/solid"
import { ContentBox } from "../UI/ContentBox"
import { UserCardSkeleton } from "../Preloaders/UserCardSkeleton"
import { URL } from "../../http"
import { useLogic } from "../../hooks/useLogic"



export const Users = () => {

    const dispatch = useAppDispatch()

    const {
        addFriend,
        goToChat,
        deleteFriend,
        acceptFriend,
        cancelSuggestation,
        rejectFriend,
    } = useLogic()

    const users = useAppSelector((state) => state.users.container)
    const isLoadingUsers = useAppSelector((state) => state.users.isLoading)
    const currentUser = useAppSelector((state) => state.currentUser.user)

    useEffect(() => {
      dispatch(getUsers({}))
    }, [])

    const handlerDelete = (id:string) => {
        dispatch(deleteUser())
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
                                            icon = {<UserPlusIcon className='text-white'/>}
                                            onClick={() => addFriend(user)}  
                                        />
                                    }
                                    {
                                        !isI && isMyRequest &&
                                        <RoundButton 
                                            title='Отозвать приглашение'  
                                            icon = {<UserMinusIcon />}
                                            onClick={() => cancelSuggestation(user._id)}  
                                        />
                                    }
                                    {
                                        isMyInvitation &&
                                        <>  
                                            <RoundButton 
                                                title='Принять приглашение'
                                                icon = {<UserPlusIcon />}
                                                onClick={()=>acceptFriend(user)}   
                                            />
                                            <RoundButton 
                                                title='Отклонить приглашение' 
                                                icon = {<UserMinusIcon />}
                                                onClick={() => rejectFriend(user._id)}     
                                            />
                                        </>
                                    }
                                    {
                                        isMyFriend &&
                                        <RoundButton 
                                            title='Удалить из друзей'  
                                            icon = {<UserMinusIcon />}
                                            onClick={() =>  deleteFriend(user._id)}       
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
