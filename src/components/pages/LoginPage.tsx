import {useEffect} from 'react'
import { Center } from '../UI/Center'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/hooks'
import { RoutePath } from '../../enums/RouteEnums'
import { loginUser } from '../../slices/currentUserSlice'
import { LocalStorageNames } from '../../enums/LocalStorageEnums'
import { Login, LoginFormNames } from '../Forms/Login'

export const LoginPage = () => {

  const dispatch = useAppDispatch()

  const handlerSubmitForm = (form: LoginFormNames) => {
    dispatch(loginUser(form))
    console.log(form);
    
  }

  return (
    <Center
      className='bg-orange-100 flex-col gap-5'
    >
        <Login
          onSubmit={handlerSubmitForm}
        />
        <Link to={RoutePath.REGISTER} className='hover:text-sky-500 underline font-medium'>I don't have an account</Link>
    </Center>
  )
}

