import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/hooks'
import { RoutePath } from '../../enums/RouteEnums'
import { LocalStorageNames } from '../../enums/LocalStorageEnums'
import { loginUser, quit } from '../../slices/currentUserSlice'

interface Actions {
    name: string
    path: string
}

const actions: Actions[] = [
    {name: 'Register',  path: RoutePath.REGISTER,},
    {name: 'Login',     path: RoutePath.LOGIN,},
    {name: 'Enter',     path: RoutePath.USER,},
    {name: 'Log Out',   path: RoutePath.HOME},
    {name: 'Demo',      path: RoutePath.USER}
]


export const Home = () => {

    const setToken = ['Enter', 'Log Out']
    const setWithoutToken = ['Register', 'Login', 'Demo']
    const token = localStorage.getItem(LocalStorageNames.TOKEN)

    const buttons = actions.filter(action => (token ? setToken : setWithoutToken).some(button => button === action.name))

    const navigate = useNavigate()

    const dispatch = useAppDispatch()


    const handlerAction: (name: string, path: string) => void = (name, path) => {
        if(['Register', 'Login', 'Enter'].some(button => button === name)){
            navigate(path)
        }
        if(name === 'Demo'){
            dispatch(loginUser({email: 'guest@guest', password: 'guest'}))
        }
        if(name === 'Log Out'){
            dispatch(quit())
        }
    }
 
  return (
    <div className='grow justify-center items-center flex flex-col gap-20'>
        <h1 className='font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center'>What are you going to do?</h1>
        {
            <ul className='flex flex-col gap-10 text-center text-3xl font-medium text-sky-500'>
                {   
                    buttons.map(page => (
                        <li key={page.name}>
                            <button 
                                className='hover:text-sky-700'
                                onClick={() => {handlerAction(page.name, page.path)}}
                            >
                                {page.name}
                            </button>
                        </li>
                    ))
                }
            </ul>
        }
    </div>
  )
}
