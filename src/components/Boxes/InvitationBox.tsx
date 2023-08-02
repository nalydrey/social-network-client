import { ContentBox } from '../UI/ContentBox'
import { MappingBox } from '../UI/MappingBox'
import { FriendPreview } from '../outputs/FriendPreview'
import { MenuItem } from '../UI/MenuItem'
import { useAppSelector } from '../../hooks/hooks'
import type { UserModel } from '../../models/UserModel'
import { URL } from '../../http'

interface InvitationBoxProps {
    onWriteMessage: (id: string) => void 
    onAccept: (user: UserModel) => void 
    onReject: (id: string) => void 
}

export const InvitationBox = ({
    onWriteMessage,
    onAccept,
    onReject,
}: InvitationBoxProps) => {

    const invitations = useAppSelector<UserModel[]>(state => state.invitations.container)


    return (
    <ContentBox 
        title='Invitation' 
    >
        <MappingBox 
            className='w-full'
            isLoading = {false}
            isAlternate = {!invitations.length}
            loadingComponent = 'Loading...'
            alternateComponent = 'Пока нет приглашений'
        >
            <ul className='grid gap-3 justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-1'>
                {invitations.map(user => (
                    <FriendPreview
                        key={user._id}
                        avatar={user.private.avatar && URL + user.private.avatar}
                        picture={user.picture && URL + user.picture}
                        title={`${user.private.firstName} ${user.private.lastName}`}
                    >
                        <ul>
                            <MenuItem
                                itemName='message'
                                itemText='Написать сообщение'
                                onChange={()=>{onWriteMessage(user._id)}}
                            />
                            <MenuItem
                                itemName='add'
                                itemText='Принять приглашение'
                                onChange={()=>{onAccept(user)}}
                            />
                            <MenuItem
                                itemName='reject'
                                itemText='Отклонить приглашение'
                                onChange={()=>{onReject(user._id)}}
                            />
                        </ul>
                    </FriendPreview>
                ))}
            </ul>
        </MappingBox>
    </ContentBox>
  )
}
