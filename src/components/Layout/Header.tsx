import { useAppDispatch, useAppSelector } from "../../hooks/hooks"
import { UserMenu } from "../InteructComponents/UserMenu"
import { UserModel } from "../../models/UserModel"
import { UserLabel } from "../InteructComponents/UserLabel"
import { Link, useNavigate } from "react-router-dom"
import { quit } from "../../slices/currentUserSlice"
import { RoutePath } from "../../enums/RouteEnums"
import { Bars3Icon, BellIcon } from "@heroicons/react/24/solid"
import { RoundButton } from "../UI/RoundButton"
import { toggleMenu } from "../../slices/appSlice"


export const Header = () => {

  const navigate = useNavigate()

  const currentUser = useAppSelector<UserModel | null>(state => state.currentUser.user)

  const dispatch = useAppDispatch()

  const goToPage = (name: string) => {
    navigate(name)
  }

  const handlerLogOut = () => {
    dispatch(quit())
  }

  const handlerToggleMenu = () => {
    dispatch(toggleMenu())
  }

 
  return (
    <header className=" bg-gradient-to-r from-sky-700 via-sky-900 to-sky-700 py-4 px-2">
      <div className="container flex items-center justify-between m-auto gap-5 sm:gap-10">
        <RoundButton
            className="md:hidden"
            title="menu"
            icon={<Bars3Icon className=" stroke-1 stroke-white"/>}
            onClick={handlerToggleMenu}
        />
        <Link to={RoutePath.HOME} className="md:text-2xl font-bold text-xl text-gray-300 py-2 select-none">Sotial-Network</Link>
        <div className="grow flex justify-end">
          <RoundButton
              title="messages"
              icon={<BellIcon />}
              onClick={()=>{}}
          />
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
