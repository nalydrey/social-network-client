import React from 'react'
import { Avatar } from '../UI/Avatar'
import { URL } from '../../http'

interface ChatItemProps {
    src: string
    isActive: boolean
    isTyping: boolean
    isOnline: boolean
    counter: number
    onClick: (id: string)=>void
    chatId: string
}

export const ChatItem = ({
    chatId,
    isActive,
    isTyping,
    isOnline,
    src,
    counter,
    onClick
}: ChatItemProps) => {
  return (
    <div 
        className={`relative mt-3 duration-300 ${isActive ? 'bg-sky-400/20': ''} rounded-md p-1`}
        onClick={() => onClick(chatId)}
    >
        <Avatar
            src = {src ? URL+src : '' }
            className=' shadow-light'
            classSize='w-14 h-14'
        />
        {
            isOnline &&
            <div className='w-4 h-4 rounded-full bg-green-500 absolute bottom-0 left-0 shadow-light'/>
        }
        {
            !!counter &&
            <div className='px-1 min-w-[25px] flex items-center justify-center font-bold text-gray-300  rounded-full bg-red-500 absolute top-0 left-0 shadow-light -translate-y-1/2'>{counter}</div>
        }
        {
            isTyping &&
            <div className='w-3 h-3 animate-ping bg-sky-500 rounded-full absolute bottom-0 right-0'/>
        }

    </div>
  )
}
