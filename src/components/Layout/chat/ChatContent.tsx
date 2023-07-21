import {useRef, useEffect} from 'react'
import { Message } from '../../outputs/Message'
import { UserModel } from '../../../models/UserModel'
import moment from 'moment'
import { MessageModel } from '../../../models/MessageModel'
import { MappingBox } from '../../UI/MappingBox'
import { URL } from '../../../http'
import { RoundButton } from '../../UI/RoundButton'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { CountLabel } from '../../outputs/CountLabel'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { turnOffFirstLoad } from '../../../slices/messagesSlice'
import { setTypingStatus } from '../../../slices/chatSlice'

interface ChatContentProps {
    isOpen: boolean
    messageCounter: number
    currentUserId: string
    content: MessageModel[]
    onDelete: (messageId: string, chatId: string) => void
    onEdit: () => void
    onVisible: (messageId: string, userId: string, isRead: boolean, chatId: string) => void
    offTyping: () => void
}

export const ChatContent = ({
    isOpen,
    messageCounter,
    content,
    currentUserId,
    onDelete,
    onVisible,
    offTyping
}:ChatContentProps) => {
    

    let firstUnreadElement: HTMLLIElement | null = null
    const isFirstLoad = useAppSelector<boolean>(state => state.messages.isFirstLoad)
    const dispatch = useAppDispatch()
    const messageContainer = useRef<HTMLDivElement>(null)
    const button = useRef<HTMLDivElement>(null)

    useEffect (()=>{
        console.log(isFirstLoad);
        offTyping()
        const lastMessage = content[content.length - 1]
        if(isFirstLoad && !!content.length){
            if(firstUnreadElement){
                firstUnreadElement.scrollIntoView({behavior: 'instant', block: 'end'})
            }
            if(!firstUnreadElement){
                toBottom('instant')
            }
            dispatch(turnOffFirstLoad())
        }
        else if(lastMessage && messageContainer.current && !isFirstLoad){
            const isEnd = messageContainer.current.scrollHeight - messageContainer.current.scrollTop <=591
            const isMyLast = lastMessage.user._id === currentUserId
            if(isOpen && (isEnd || isMyLast)){
                toBottom('smooth')
            }
        }
    },[content.length]) 

    useEffect (()=>{
        if(messageContainer.current){
            messageContainer.current.addEventListener('scroll', handlerScroll)
            handlerScroll()
        }
        return () => {
            if(messageContainer.current){
                messageContainer.current.removeEventListener('scroll', handlerScroll)
            }
        }
    },[messageContainer.current])

    const handlerScroll = () => {
        if(messageContainer.current){
            const isEnd = messageContainer.current.scrollHeight - messageContainer.current.scrollTop <=510
            if(button.current){
                if(isEnd){
                    button.current.style.bottom = '-70px'
                }
                else{
                    button.current.style.bottom = '10px'
                }
            }
        }
    }


    const setFirstUnreadElement = (elem: HTMLLIElement) => {
        firstUnreadElement = elem
    }

    const toBottom = (behavior: 'smooth' | 'instant' ) => {
        if(messageContainer.current){
            const scrollHeight = messageContainer.current.scrollHeight
            messageContainer.current.scrollTo({top: scrollHeight, behavior})
        }
    }
    
    const firstUnread = content.find(message => !message.isRead)
    

  return (
    <MappingBox
        isAlternate = {!content.length}
        alternateComponent = {'No Messages'}
    >
        <div className='relative overflow-hidden'>
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
                                setFirst= {(elem) => (setFirstUnreadElement(elem)) }
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
            <div 
                className='absolute right-5 -bottom-40 duration-300'
                ref = {button}    
            >
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
