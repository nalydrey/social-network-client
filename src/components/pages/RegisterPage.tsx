import {useEffect} from 'react'
import { Center } from '../UI/Center'
import { Register, RegisterFormNames } from '../Forms/Register'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/hooks'
import { RoutePath } from '../../enums/RouteEnums'
import { createUser } from '../../slices/currentUserSlice'
import { LocalStorageNames } from '../../enums/LocalStorageEnums'

export const RegisterPage = () => {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const token = localStorage.getItem(LocalStorageNames.TOKEN)

  useEffect(()=> {
    if(token){
      navigate(RoutePath.HOME + RoutePath.USER)
    }
  }, [token])

  const handlerSubmitForm = (form: RegisterFormNames) => {
    dispatch(createUser(form))
  }

  return (
    <Center
      className='bg-orange-100 flex-col gap-5'
    >
        <Register
          onSubmit={handlerSubmitForm}
        />
        <Link to={RoutePath.LOGIN} className='hover:text-sky-500 underline font-medium'>I have an account</Link>
    </Center>
  )
}
