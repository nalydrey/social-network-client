import { useAppDispatch, useAppSelector } from "../../hooks/hooks"
import { UserMenu } from "../InteructComponents/UserMenu"
import { UserLabel } from "../InteructComponents/UserLabel"
import { Link, useNavigate } from "react-router-dom"
import { quit } from "../../slices/currentUserSlice"
import { RoutePath } from "../../enums/RouteEnums"
import { BellIcon } from "@heroicons/react/24/solid"
import { RoundButton } from "../UI/RoundButton"
import { chatOpen } from "../../slices/chatSlice"


export const Header = () => {

  const navigate = useNavigate()

  const currentUser = useAppSelector(state => state.currentUser.user)
  const {messageCounter, isOpenChatBar} = useAppSelector(state => state.chats)

  const dispatch = useAppDispatch()

  const goToPage = (name: string) => {
    navigate(name)
  }

  const handlerLogOut = () => {
    dispatch(quit())
  }

 const handlerChat = () => {
    dispatch(chatOpen(!isOpenChatBar))
 }


  return (
    <header className="z-30 fixed w-full  bg-gradient-to-r from-sky-700/90 via-sky-900/90 to-sky-700/90 py-4 px-2">
      <div className="container flex items-center justify-between m-auto gap-5 sm:gap-10">
        <Link to={RoutePath.HOME} className="md:text-2xl font-bold text-xl text-gray-300 py-2 select-none">Sotial-Network</Link>
        <div className="grow flex justify-end">
          {
            currentUser &&
            <RoundButton
                title="messages"
                counter={messageCounter}
                icon={<BellIcon />}
                onClick={handlerChat}
            />
          }
        </div>
        {
          currentUser ?
            <UserLabel
              avatar={currentUser.private.avatar}
              firstName={currentUser.private.firstName}
              onLogout={handlerLogOut}
              onProfile={(name)=>goToPage(`${RoutePath.USER}/${name}`)}
            />
            :
            <UserMenu
              onLogin={goToPage}
              onRegister={goToPage}
            />
        }
       
      </div>
    </header>
  )
}
