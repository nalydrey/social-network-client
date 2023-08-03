import {ChangeEvent, ReactNode} from 'react'
import preloader from '../../assets/Spinner-1s-197px.svg'


interface InputButtonProps {
    name: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    icon: ReactNode
    isLoading?: boolean
    className?: string
}

export const InputButton = ({
    isLoading,
    onChange,
    icon,
    name,
    className,
}: InputButtonProps) => {
  return (
    <label htmlFor={name} className={`${className} p-1 h-9 w-9 bg-sky-500 cursor-pointer flex sm:w-12 sm:h-12 items-center justify-center rounded-full duration-300 hover:scale-125`}>
        {
            isLoading ?
            <img src={preloader} />
            :
            <span className={`w-full h-full text-gray-200`}>{icon}</span>
        }
        <input  className='hidden' 
                type='file' 
                id={name}
                name = {name}
                accept='.jpg, .png' 
                onChange={onChange}
        />
    </label>
  )
}
