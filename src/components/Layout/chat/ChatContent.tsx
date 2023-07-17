import {useRef, useEffect, useState} from 'react'
import { Message } from '../../outputs/Message'
import { UserModel } from '../../../models/UserModel'
import moment from 'moment'
import { MessageModel } from '../../../models/MessageModel'
import { MappingBox } from '../../UI/MappingBox'
import { URL } from '../../../http'
import { RoundButton } from '../../UI/RoundButton'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { CountLabel } from '../../outputs/CountLabel'

interface ChatContentProps {
    messageCounter: number
    currentUserId: string
    content: MessageModel[]
    onDelete: (messageId: string, chatId: string) => void
    onEdit: () => void
    onVisible: (messageId: string, userId: string, isRead: boolean, chatId: string) => void
}

export const ChatContent = ({
    messageCounter,
    content,
    currentUserId,
    onDelete,
    onVisible
}:ChatContentProps) => {
    
    let firstUnreadElement: HTMLLIElement | null = null
    const messageContainer = useRef<HTMLDivElement>(null)

    const toFirst = (elem: HTMLLIElement) => {
            firstUnreadElement = elem
    }

    useEffect (()=>{

        console.log(firstUnreadElement);
        
        const lastMessage = content[content.length - 1]
        if(lastMessage && messageContainer.current){
            const isEnd = messageContainer.current.scrollHeight - messageContainer.current.scrollTop <=591
            const isMyLast = lastMessage.user._id === currentUserId
            if(!firstUnreadElement){
                toBottom('instant')
            }
            else if(isEnd || isMyLast){
                toBottom('smooth')
            }
            else if(firstUnreadElement){
                firstUnreadElement.scrollIntoView({behavior: 'instant', block: 'end'})
            }
        }
    },[content]) 

    const toBottom = (behavior: 'smooth' | 'instant' ) => {
        if(messageContainer.current){
            const scrollHeight = messageContainer.current.scrollHeight
            messageContainer.current.scrollTo({top: scrollHeight, behavior})
        }
    }

    


    const firstUnread = content.find(message => !message.isRead)
    console.log(firstUnread);
    

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
                                messageId={_id}
                                text = {text}
                                isRead = {isRead}
                                container = {messageContainer}
                                setFirst= {(elem) => (toFirst(elem)) }
                                isFirstUnread = {firstUnread?._id === message._id}
                                isMyMessage = {user._id === currentUserId}
                                time = {moment(createdAt).format('D MMM HH:mm')}
                                src={user.private.avatar ? URL + user.private.avatar : ''}
                                onDelete={() => onDelete(message._id, message.chat)}
                                onVisible={()=> (typeof message.user === 'object') && onVisible(message._id, message.user._id, message.isRead, message.chat )}
                            />
                        )
                    }
                    )}
                </ul>
            </div>
            <div className='absolute bottom-0 right-5'>
                <RoundButton
                    d = {10}
                    onClick={() => toBottom('smooth')}
                    icon = {<ChevronDownIcon className='h-8 fill-white'/>}
                />
                <CountLabel
                    counter = {messageCounter}
                    positionClass='top-0 left-1/2 -translate-x-1/2 -translate-y-3/4'
                />
            </div>
        </div>
    </MappingBox>
  )
}
