import { useEffect} from 'react'
import { Users } from "./components/pages/Users"
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
import { RegisterPage } from './components/pages/RegisterPage'
import { RoutePath } from './enums/RouteEnums'
import { LocalStorageNames } from './enums/LocalStorageEnums'
import { LoginPage } from './components/pages/LoginPage'
import { FriendBox } from './components/pages/FriendBox'
import { useLogic } from './hooks/useLogic'
import { Chat } from './components/pages/Chat'


export const socket = io(URL, {auth:{
  user: localStorage.getItem(LocalStorageNames.CURRENT_USER)
}})

function App() {

  

  const navigate = useNavigate()

  const controller = useStateController()

  const {
    acceptFriend,
    cancelSuggestation,
    deleteFriend,
    goToChat,
    rejectFriend
  } = useLogic()

  const currentUser = useAppSelector(state => state.currentUser.user)

  const {
    friends,
    invitations,
    suggestations
  } = useAppSelector(state => ({
          friends: state.friends.container,
          suggestations: state.suggestations.container,
          invitations: state.invitations.container
  }))
  
  const dispatch = useAppDispatch()

  const currentUserId = currentUser?._id || null


  useEffect(()=>{
    const userId = localStorage.getItem(LocalStorageNames.CURRENT_USER)
    if(true){
      dispatch(enter()) 
    } 
    dispatch(getUsers({})) 
  },[])

  useEffect(()=>{
    if (currentUser){
     navigate(RoutePath.HOME + RoutePath.USER)
      subscribes(dispatch, currentUser, controller)
      userLoads(dispatch, currentUser)
    }
    else {
      navigate(RoutePath.HOME)
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
            <Route path={RoutePath.CHATS} element={<Chat />} />
            <Route path={RoutePath.FRIENDS} element={
              <FriendBox 
                title='Friends'
                content={friends}
                onWriteMessage={goToChat}
                onDeleteFromFriends={deleteFriend}
              />}
             />
            <Route path={RoutePath.INVITATIONS} element={
              <FriendBox 
                title='Invitations'
                content={invitations}  
                onWriteMessage={goToChat}
                onAccept={acceptFriend}
                onReject={rejectFriend}
              />}
            />
            <Route path={RoutePath.SUGGESTATIONS} element={
              <FriendBox 
                title='Suggestations'
                content={suggestations}  
                onWriteMessage={goToChat}
                onCancel = {cancelSuggestation}
              />}
            />
          </Route>
          <Route path={RoutePath.REGISTER} element={<RegisterPage/>}/>
          <Route path={RoutePath.LOGIN} element={<LoginPage/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
