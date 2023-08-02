import { ContentBox } from '../UI/ContentBox'
import { MappingBox } from '../UI/MappingBox'
import { FriendPreview } from '../outputs/FriendPreview'
import { MenuItem } from '../UI/MenuItem'
import { useAppSelector } from '../../hooks/hooks'
import { UserModel } from '../../models/UserModel'
import { URL } from '../../http'

interface SuggestationBoxProps {
    onWriteMessage: (id: string) => void 
    onCancel: (id: string) => void 
}

export const SuggestationBox = ({
    onWriteMessage,
    onCancel,
}: SuggestationBoxProps) => {

    const suggestations = useAppSelector<UserModel[]>(state => state.suggestations.container)


return (
    <ContentBox 
        title='Suggestation'
    >
        <MappingBox 
            className='w-full'
            isLoading = {false}
            isAlternate = {!suggestations.length}
            loadingComponent = 'Loading...'
            alternateComponent = 'Пока нет предложений'
        >
            <ul className='grid gap-3 justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-1'>
                {suggestations.map(user => (
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
                                itemName='reject'
                                itemText='Отозвать приглашение'
                                onChange={()=>{onCancel(user._id)}}
                            />
                        </ul>
                    </FriendPreview>
                ))}
            </ul>
        </MappingBox>
    </ContentBox>
)
}
