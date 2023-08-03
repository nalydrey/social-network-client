import { useState } from "react";
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid'
import { Avatar } from '../../UI/Avatar'
import { Tooltip } from '../../UI/Tooltip'
import { MenuItem } from '../../UI/MenuItem'

interface ChatHeaderProps {
    isTyping: boolean
    avatar: string
    isOnline: boolean
    chatName: string
    onHide: () => void
    onDelete: () => void
}

export const ChatHeader = ({
    onHide,
    onDelete,
    isTyping,
    avatar,
    isOnline,
    chatName
}: ChatHeaderProps) => {

    const [isOpen, setOpen] = useState(false)

    const handleOpen = () => {
        setOpen(!isOpen)
    }

  return (
    <div className='flex py-1 px-5 items-center border-b-4 border-sky-800'>
        <div className='relative mb-1'>
            <Avatar 
                src={avatar}
                className='shadow-light'
            />
            {
                isOnline &&    
                <div className='absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/4 w-3 h-3 rounded-full bg-green-600'/>
            }
        </div>
        <div className="grow">
            <p className='text-center text-2xl font-bold text-sky-700'>
                {chatName}
            </p>
            <p className={`text-center text-lg font-medium text-blue-600 h-7 animate-bounce  duration-300 ${isTyping ? 'opacity-100': 'opacity-0'}`}>Typing...</p>
        </div>
        <div className="relative">
                        
                        <button className=""
                            onClick={handleOpen}
                        >
                            <EllipsisHorizontalIcon className="h-5"/>
                        </button>
                        <Tooltip 
                            className='right-0 top-[110%]'
                            isOpen={isOpen}  
                    >
                        <ul>
                            <MenuItem
                                itemName="hide"
                                itemText={'Hide'}
                                onChange={onHide}
                            />              
                            <MenuItem
                                itemName="delete"
                                itemText={'Delete'}
                                onChange={onDelete}
                            />              
                        </ul>
                        </Tooltip>
                    </div>
    </div>
  )
}
