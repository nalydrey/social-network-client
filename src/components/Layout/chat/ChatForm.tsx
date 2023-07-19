import { useState, ChangeEvent, KeyboardEvent, SyntheticEvent, useRef } from 'react';
import { useFormik } from 'formik'
import { RoundButton } from '../../UI/RoundButton'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import * as Yup from 'yup'
import { socket } from '../../../App';

interface ChatFormProps {
    onStartTyping: () => void
    onFinishTyping: () => void
    onSubmit: (text: string) => void
}


export const ChatForm = ({
    onStartTyping,
    onFinishTyping,
    onSubmit
}: ChatFormProps) => {

    const [timer, setTimer] = useState<number>(0)
    
    const formik = useFormik({
        initialValues:{
            message:''
        },
        validationSchema: Yup.object({
            message: Yup.string().required('Required')
            }),
        onSubmit: (value, helpers) => {
            onSubmit(value.message)
            helpers.resetForm()
        }
    })

    

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if(e.target.scrollTop){
            const totalHeight = e.target.scrollTop + e.target.scrollHeight
            e.target.style.height = totalHeight + 'px'
        }
        formik.handleChange(e)
    }


    const handletTextarea = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        clearTimeout(timer)
        let newTimer: number = timer
        if(!timer){
            console.log('tiping...');
            onStartTyping()
            newTimer = setTimeout(()=> {
                console.log('off');
                onFinishTyping()
                clearTimeout(newTimer)
                setTimer(0)
            }, 2000)
            setTimer(newTimer)
        }
        else{
            newTimer = setTimeout(()=> {
                console.log('off');
                onFinishTyping()
                clearTimeout(newTimer)
                setTimer(0)
            }, 2000)
            setTimer(newTimer)
        }

        const element = e.target as HTMLElement
        if(e.key === 'Enter'){
            clearTimeout(newTimer)
            setTimer(0)
            e.preventDefault()
            element.style.height = 40 + 'px'
            formik.handleSubmit()
        }
    }

   

  return (
    <form 
        className='flex gap-2 p-2 border-t-4 border-sky-700'
        onSubmit={formik.handleSubmit}
    >
        <textarea 
            className=' duration-300 overflow-hidden resize-none w-full border-2 border-sky-500 px-3 rounded-lg focus:outline-sky-500 focus:outline-4 font-medium text-lg text-sky-700' 
            name='message'
            id='message'
            placeholder='Your message ...'
            value={formik.values.message}
            onChange={handleChange}
            onKeyDown={handletTextarea}
        />
        <RoundButton
            title='Send'
            d={10}
            classWrap='self-end'
            icon = {<PaperAirplaneIcon className='w-6 h-6 text-slate-300'/>}
            type='submit' 
        />
    </form>
  )
}
