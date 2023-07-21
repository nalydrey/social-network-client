import { useEffect} from 'react'
import { Users } from "./components/pages/Users"
import { UserModel } from './models/UserModel'
import { enter} from './slices/currentUserSlice'
import { Route, Routes, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "./hooks/hooks"
import { Profile } from './components/pages/Profile'
import { MyPosts } from './components/pages/MyPosts'
import { Posts } from './components/pages/Posts'
import { subscribes, unsubscribe } from './subscribes'
import { userLoads } from './userLoads'
import { getUsers } from './slices/usersSlice'
import { URL } from './http'
import { useStateController } from './hooks/useStateController'
import {io} from 'socket.io-client'
import { Layout } from './components/Layout/Layout'
import { MainUser } from './components/pages/MainUser'
import { Home } from './components/pages/Home'
import { Login } from './components/Forms/Login'
import { RegisterPage } from './components/pages/RegisterPage'
import { RoutePath } from './enums/RouteEnums'
import { LocalStorageNames } from './enums/LocalStorageEnums'


export const socket = io(URL, {auth:{
  user: localStorage.getItem(LocalStorageNames.CURRENT_USER)
}})

function App() {

  const navigate = useNavigate()

  const controller = useStateController()

  const currentUser = useAppSelector<UserModel | null>(state => state.currentUser.user)
  
  const dispatch = useAppDispatch()

  const currentUserId = currentUser?._id || null


  useEffect(()=>{
    const userId = localStorage.getItem(LocalStorageNames.CURRENT_USER)
    if(userId){
      dispatch(enter(userId)) 
      navigate(RoutePath.USER)
    } 
    dispatch(getUsers({})) 
  },[])

  
  useEffect(()=>{
   if (currentUser){
      subscribes(dispatch, currentUser, controller)
      userLoads(dispatch, currentUser)
    }
    return () => {unsubscribe()}
  },[currentUserId])

  return (
    <>
      <Routes>
        <Route path={RoutePath.HOME} element={<Layout/>}>
          <Route index element = {<Home/>}/>
          <Route path={RoutePath.HOME+RoutePath.USER} element = {<MainUser/>}>
            <Route index element={<Users/>}/>
            <Route path={RoutePath.PROFILE} element={<Profile />}/>
            <Route path={RoutePath.MY_POSTS} element={<MyPosts />} />
            <Route path={RoutePath.POSTS} element={<Posts />} />
          </Route>
          <Route path={RoutePath.REGISTER} element={<RegisterPage/>}/>
          <Route path={RoutePath.LOGIN} element={<Login/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
