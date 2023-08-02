import { ContentBox } from '../UI/ContentBox'
import { MappingBox } from '../UI/MappingBox'
import type { UserModel } from '../../models/UserModel'
import { FriendPreview } from '../outputs/FriendPreview'
import { MenuItem } from '../UI/MenuItem'
import { URL } from '../../http'

interface FriendBoxProps {
    onWriteMessage?: (id: string) => void 
    onDeleteFromFriends?: (id: string) => void 
    onReject?: (id: string) => void 
    onCancel?: (id: string) => void 
    onAccept?: (user: UserModel) => void 
    content: UserModel[]
    title: string
}

export const FriendBox = ({
    title,
    content,
    onWriteMessage, 
    onDeleteFromFriends,
    onAccept,
    onReject,
    onCancel
}: FriendBoxProps) => {

  return (
    <ContentBox 
        title={title}
    >
        <MappingBox 
            className='w-full'
            isLoading = {false}
            isAlternate = {!content.length}
            loadingComponent = 'Loading...'
            alternateComponent = 'Пока нет друзей'
        >
            <ul className='grid gap-3 justify-items-center sm:grid-cols-2 md:grid-cols-1'>
                {
                content.map(user => (
                    <FriendPreview
                        key={user._id}
                        avatar={user.private.avatar && URL + user.private.avatar}
                        picture={user.picture && URL + user.picture}
                        title={`${user.private.firstName} ${user.private.lastName}`}
                    >
                        <ul>
                            {
                                onWriteMessage &&
                                <MenuItem
                                    itemName='message'
                                    itemText='Написать сообщение'
                                    onChange={()=>{onWriteMessage(user._id)}}
                                />
                            }
                            {
                                onDeleteFromFriends &&
                                <MenuItem
                                    itemName='delete'
                                    itemText='Удалить из друзей'
                                    onChange={()=>{onDeleteFromFriends(user._id)}}
                                />
                            }
                            {
                                onAccept &&
                                <MenuItem
                                    itemName='add'
                                    itemText='Принять приглашение'
                                    onChange={()=>{onAccept(user)}}
                                />
                            }
                            {
                                onReject &&
                                <MenuItem
                                    itemName='reject'
                                    itemText='Отклонить приглашение'
                                    onChange={()=>{onReject(user._id)}}
                                />
                            }
                            {
                                onCancel &&
                                <MenuItem
                                    itemName='cancel'
                                    itemText='Отозвать приглашение'
                                    onChange={()=>{onCancel(user._id)}}
                                />
                            }
                        </ul>
                    </FriendPreview>
                ))
                }
            </ul>
        </MappingBox>
    </ContentBox>
  )
}
