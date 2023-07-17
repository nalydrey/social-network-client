import {useRef, useEffect, useState} from 'react'
import { Message } from '../../outputs/Message'
import { UserModel } from '../../../models/UserModel'
import moment from 'moment'
import { MessageModel } from '../../../models/MessageModel'
import { MappingBox } from '../../UI/MappingBox'
import { URL } from '../../../http'

interface ChatContentProps {
    currentUserId: string
    content: MessageModel[]
    onDelete: (messageId: string, chatId: string) => void
    onEdit: () => void
    onVisible: (messageId: string, userId: string, isRead: boolean, chatId: string) => void
}

export const ChatContent = ({
    content,
    currentUserId,
    onDelete,
    onVisible
}:ChatContentProps) => {
    console.log(1);
    
    const messageContainer = useRef<HTMLDivElement>(null)

    const toLast = (elem: HTMLLIElement) => {
        if(messageContainer.current &&  messageContainer.current.scrollHeight - messageContainer.current.scrollTop <=591){
            elem.scrollIntoView({behavior: 'smooth'})
        }
    }

    const toFirst = (elem: HTMLLIElement) => {
            elem.scrollIntoView({behavior: 'instant', block: 'end'})
    }


    const firstUnread = content.find(message => !message.isRead)

  return (
    <MappingBox
        isAlternate = {!content.length}
        alternateComponent = {'No Messages'}
    >
        <div className='relative'>
            <div ref={messageContainer} className=' max-h-[500px] overflow-auto'>
                <ul className='py-2 px-3 flex flex-col gap-3 '>
                    {content.map((message, i) => {
                        const user = message.user as UserModel
                        const {text, isRead, createdAt, _id} = message
                        return (
                            <Message
                                key={_id}
                                container = {messageContainer}
                                messageId={_id}
                                isFirstUnread = {firstUnread?._id === message._id}
                                isLast = {content.length-1 === i}
                                setLast = {(elem)=>{toLast(elem)}}
                                setFirst= {(elem) => (toFirst(elem)) }
                                src={user.private.avatar ? URL + user.private.avatar : ''}
                                isMyMessage = {user._id === currentUserId}
                                isRead = {isRead}
                                time = {moment(createdAt).format('D MMM HH:mm')}
                                text = {text}
                                onVisible={()=> (typeof message.user === 'object') && onVisible(message._id, message.user._id, message.isRead, message.chat )}
                                onDelete={() => onDelete(message._id, message.chat)}
                            />
                        )
                    }
                    )}
                </ul>
            </div>
            <div className='bg-gray-500 w-7 h-7 absolute bottom-0 right-5 rounded-full'>

            </div>
        </div>
    </MappingBox>
  )
}
