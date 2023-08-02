import {useState, ReactNode, MouseEvent} from 'react'
import { Info } from './Info'
import preloader from '../../assets/Spinner-1s-197px.svg'

interface RoundButton {
    d?: number
    type ?: 'button' | 'submit' | 'reset'
    icon: ReactNode
    labelPlace?: 'top' | 'bottom'
    disabled?: boolean
    className?: string
    classWrap?: string
    isLoading?: boolean
    title?: string
    counter?: number
    onClick?: (e:MouseEvent)=>void
}

export const RoundButton = ({
    labelPlace = 'top',
    counter,
    d = 10,
    icon,
    disabled = false,
    isLoading = false,
    type,
    title,
    className='',
    classWrap,
    onClick = () =>{}
}:RoundButton) => {


    const [isActive, setActive] = useState(false)

  return (
    <div className={`relative group ${classWrap}`}>
        <button className={`${className} rounded-full w-${d} h-${d} bg-blue-400 p-1 flex justify-center items-center shadow-light duration-200 active:scale-90`}
            type = {type}
            disabled = {disabled}
            onClick={(e)=>{setActive(true); onClick(e)}}   
        >   
        {
            isLoading&&isActive ? 
            <img src={preloader} className='fill-white' />
            :
            <span className={`w-full h-full text-white`}>{icon}</span>
        }

        </button>
        {
            title &&
            <Info className='top-[110%] left-1/2 -translate-x-1/2'
                text={title}
            />            
        }
        {
            !!counter &&
            <div className={`px-2 border border-white min-w-[25px] flex text-lg items-center justify-center font-bold text-gray-300 rounded-full bg-red-500 absolute left-1/2 shadow-light -translate-x-1/2 ${labelPlace === 'top' ? 'top-0 -translate-y-1/2': 'bottom-0 translate-y-1/2'} `}>{counter}</div>
        }
    </div>
  )
}
