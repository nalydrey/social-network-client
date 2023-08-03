import { Outlet } from 'react-router-dom'
import { TopBox } from '../Layout/TopBox'
import { FriendBox } from './FriendBox'
import { useAppSelector } from '../../hooks/hooks'
import { changeMyAvatar, changeMyPicture } from '../../slices/currentUserSlice'
import { useLogic } from '../../hooks/useLogic'

export const MainUser = () => {

  const {
    changeImage,
    goToChat,
    cancelSuggestation,
    acceptFriend,
    deleteFriend,
    rejectFriend
  } = useLogic()

  const {
    friends,
    invitations,
    suggestations
  } = useAppSelector(state => ({
    friends:state.friends.container,
    suggestations: state.suggestations.container,
    invitations: state.invitations.container
  }))


  return (
    <div className='my-5 grow'>
      <div className=' container mx-auto'>
        <TopBox 
          onChangePicture={(e) => changeImage(e, changeMyPicture)}
          onChangeAvatar={(e) => changeImage(e, changeMyAvatar)}
        />
        <div className='flex flex-col gap-5 relative  mx-1 md:flex-row'>
          <div className='hidden md:flex flex-col gap-5 w-full md:max-w-[270px]'>
            <FriendBox
                title='Friends'
                content={friends}
                onWriteMessage={goToChat}
                onDeleteFromFriends={deleteFriend}
            />
            <FriendBox
                title='Invitations'
                content={invitations}
                onWriteMessage={goToChat}
                onAccept={acceptFriend}
                onReject={rejectFriend}
            />
            <FriendBox
                title='Suggestations'
                content={suggestations}
                onWriteMessage={goToChat}
                onCancel = {cancelSuggestation}
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
