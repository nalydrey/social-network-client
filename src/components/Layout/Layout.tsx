import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { ChatBar } from '../outputs/ChatBar'
import { Info } from './Info'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { setInfo } from '../../slices/infoSlice'

export const Layout = () => {

  const {info} = useAppSelector<{info: string}>(state => state.info) 

  return (
    <div className='flex flex-col min-h-screen '>
        <Header/>
        <div className='relative flex bg-orange-100 grow'>
          <Outlet/>
          <ChatBar/>
          <Info
            text={info}
          />
        </div>
    </div>
  )
}
