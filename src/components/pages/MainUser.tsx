import React, { ChangeEvent } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { TopBox } from '../Layout/TopBox'
import { FriendBox } from '../Boxes/FriendBox'
import { InvitationBox } from '../Boxes/InvitationBox'
import { SuggestationBox } from '../Boxes/SuggestationBox'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { UserModel } from '../../models/UserModel'
import { controlMessageModal } from '../../slices/auxiliarySlice'
import { changeMyAvatar, changeMyPicture } from '../../slices/currentUserSlice'
import { matchedValueInArr } from '../../customFunctions/isCoincidenceInArr'
import { socket } from '../../App'
import { useStateController } from '../../hooks/useStateController'
import { SocketEmmits } from '../../enums/SocketEnums'
import { useLogic } from '../../hooks/useLogic'

export const MainUser = () => {

    const navigate = useNavigate()

    const controller = useStateController()
  const {
    removeFromSuggestation,
  } = controller

  const {
    acceptFriend,
    deleteFriend,
    rejectFriend
  } = useLogic()


    const dispatch = useAppDispatch()

    const currentUser = useAppSelector<UserModel | null>(state => state.currentUser.user)
    const users = useAppSelector<UserModel[]>(state => state.users.container)
    const messageCounter = useAppSelector<number>(state => state.chats.messageCounter)
    const friends = useAppSelector(state => state.friends.container)

   
      const changeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        const avatar = new FormData()
        files && avatar.append('avatar', files[0])
        dispatch(changeMyAvatar({file: avatar}))
      }
      
      const changePicture = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        const avatar = new FormData()
        files && avatar.append('picture', files[0])
        dispatch(changeMyPicture({file: avatar}))
      }
    
      const goToChat: (userId: string) => void = (userId) => {
        if(currentUser){
            const state = {
                isCreateNewChat: false,
                activeChat: '',
                userId
            }
    
            const userChats = users.find((user) => user._id === userId)?.chats
            if (userChats) {
                const matchedChat = matchedValueInArr(currentUser.chats, userChats)
                if (matchedChat) {
                //переходим в чат
                state.isCreateNewChat = false
                state.activeChat = matchedChat
                } 
                else {
                //Создаем новый чат
                state.isCreateNewChat = true
                }
                navigate("/chats", {state})
            }
        }
    }
    
    
    const handlerCancelSuggestation = (userId:string) => {
        removeFromSuggestation({userId})
        socket.emit<SocketEmmits>(SocketEmmits.CANCEL_SUGGESTATION, {friendId: userId})
    }
    
   
    
  
    

  return (
    <div className='my-5 grow'>
        <div className=' container mx-auto'>
            <TopBox 
                messageCounter={messageCounter}
                onChangePicture={changePicture}
                onChangeAvatar={changeAvatar}
            />
            <div className='flex flex-col gap-5 relative  mx-1 md:flex-row'>
                <div className='hidden md:flex flex-col gap-5 w-full md:max-w-[270px]'>

                    <FriendBox
                        title='Friends'
                        content={friends}
                        onWriteMessage={goToChat}
                        onDeleteFromFriends={deleteFriend}
                    />

                    <InvitationBox
                        onWriteMessage={goToChat}
                        onAccept={acceptFriend}
                        onReject={rejectFriend}
                    />
                    
                    <SuggestationBox
                        onWriteMessage={goToChat}
                        onCancel = {handlerCancelSuggestation}
                    />
                
                </div>
                <div className={`w-full`}>
                   <Outlet/>
                </div>
            </div>
        </div>
    </div>
  )
}
