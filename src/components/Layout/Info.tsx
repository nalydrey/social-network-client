import {useEffect} from 'react'
import { useAppDispatch } from "../../hooks/hooks"
import { setInfo } from "../../slices/infoSlice"


interface InfoProps {
    text: string
}

export const Info = ({text}: InfoProps) => {

    const dispatch = useAppDispatch()

    useEffect(()=>{
        const timer = setTimeout(()=>{
            dispatch(setInfo(''))
        }, 3000)
        return () => {
            clearTimeout(timer)
        }
    }, [text])

  return (
    <>
        {   
            !!text &&
            <div className=' absolute top-1/2 left-1/2 shadow-light rounded-lg -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-sky-300 w-96 h-72'>
                <h1 className='text-3xl font-bold text-sky-700 text-center'>{text}</h1>
            </div>
            
        }
    </>
  )
}
