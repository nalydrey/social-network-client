import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { ChatBar } from '../outputs/ChatBar'
import { Info } from './Info'
import { useAppSelector } from '../../hooks/hooks'
import { MainMenu } from '../UI/MainMenu'

export const Layout = () => {

  const {info} = useAppSelector<{info: string}>(state => state.info) 
  const app = useAppSelector(state => state.app)
  const currentUser = useAppSelector(state => state.currentUser.user)

  return (
    <div className='flex flex-col min-h-screen '>
        <Header/>
        <div className='relative flex bg-orange-100 grow pt-20 px-1'>
          <Outlet/>
          {
            currentUser &&
            <ChatBar/>
          }
          <Info
            text={info}
          />
          <MainMenu
            isOpen = {app.menuWindow}
          />
        </div>
    </div>
  )
}
