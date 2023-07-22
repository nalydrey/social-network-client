import { useAppDispatch, useAppSelector } from "../../hooks/hooks"
import { UserMenu } from "../InteructComponents/UserMenu"
import { UserModel } from "../../models/UserModel"
import { UserLabel } from "../InteructComponents/UserLabel"
import { Link, useNavigate } from "react-router-dom"
import { quit } from "../../slices/currentUserSlice"
import { RoutePath } from "../../enums/RouteEnums"
import { LocalStorageNames } from "../../enums/LocalStorageEnums"

interface HeaderProps {
}

export const Header = ({
}:HeaderProps) => {

  const navigate = useNavigate()

  const currentUser = useAppSelector<UserModel | null>(state => state.currentUser.user)

  const dispatch = useAppDispatch()

  const goToPage = (name: string) => {
    navigate(name)
  }

  const handlerLogOut = () => {
    localStorage.removeItem(LocalStorageNames.TOKEN)
    dispatch(quit())
    navigate(RoutePath.HOME)
  }
 



  return (
    <header className=" bg-gradient-to-r from-sky-700 via-sky-900 to-sky-700 py-3 px-2">
      <div className="container flex items-center justify-between m-auto">
        <Link to={RoutePath.HOME} className="font-bold text-2xl text-gray-300 py-2">Sotial-Network</Link>
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
