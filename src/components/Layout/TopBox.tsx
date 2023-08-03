import { MouseEvent, useEffect, useState } from 'react'
import { CameraIcon, EllipsisHorizontalIcon, PhotoIcon } from '@heroicons/react/24/solid'
import {ChangeEvent} from 'react'
import { URL } from '../../http'
import { ButtonUnderline } from '../UI/ButtonUnderline'
import { useLocation, useNavigate } from 'react-router-dom'
import { ImageWithPreloader } from '../UI/ImageWithPreloader'
import { Avatar } from '../UI/Avatar'
import { useAppSelector } from '../../hooks/hooks'
import { RoutePath } from '../../enums/RouteEnums'
import { InputButton } from '../UI/InputButton'
import { Tooltip } from '../UI/Tooltip'
import { MenuItem } from '../UI/MenuItem'

interface TopBoxProps {
    onChangeAvatar: (e: ChangeEvent<HTMLInputElement>)=>void
    onChangePicture: (e: ChangeEvent<HTMLInputElement>)=>void
}


export const TopBox = ({
    onChangeAvatar=()=>{},
    onChangePicture=()=>{},
}:TopBoxProps) => {

    const host = URL + RoutePath.HOME

    const currentUser = useAppSelector(state => state.currentUser.user)

    const {isLoadingAvatar, isLoadingPicture} = useAppSelector(state => state.currentUser.loadings)

    const avatar = currentUser && currentUser.private.avatar ? host + currentUser.private.avatar : ''
    const picture = currentUser && currentUser.picture ? host + currentUser.picture : ''
    const firstName = currentUser ? currentUser.private.firstName : ''
    const lastName = currentUser ? currentUser.private.lastName : ''

    const navigate = useNavigate()
    const location = useLocation()

    const [isOpen, setOpen] = useState<boolean>(false)
 
    const handleOpen = (e: MouseEvent) => {
        e.stopPropagation()
        setOpen(!isOpen)
    }

    const handleMove = (path: string) => {
        navigate(path)
        setOpen(false)
    }

    useEffect (()=>{
        document.addEventListener('click', handlerClose)

        return () => {
            document.removeEventListener('click', handlerClose)
        }
    },[])

    const handlerClose = () => {
        setOpen(false)
    }

    

  return (
    <div className='box mb-4 mx-1 '>

        <div className='relative pt-[30%] sm:pt-[20%] bg-indigo-400 w-full bg-cover bg-center bg-no-repeat'>
            <ImageWithPreloader 
                className=' absolute top-0' 
                src={picture} 
                alt='picture'
            />
            <div className='absolute bottom-0 right-0 px-5 translate-y-0 sm:translate-y-1/2 z-10 flex gap-3'>
                <InputButton
                    isLoading = {isLoadingAvatar}
                    icon = {<CameraIcon />}
                    name='avatar'
                    onChange={onChangeAvatar}
                />
                <InputButton
                    isLoading = {isLoadingPicture}
                    icon = {<PhotoIcon />}
                    name='picture'
                    onChange={onChangePicture}
                />
            </div>
        </div>

        <div className='min-h-[50px] relative bg-slate-300 flex flex-col justify-end'>
            <div className='absolute -translate-y-3/4 top-0 left-2 sm:left-5'>
                <div className='flex flex-col sm:flex-row items-start sm:items-end text-white'>
                    <Avatar
                        className="relative border-4 lg:border-8 border-slate-300 shadow-light"
                        classSize="w-20 h-20 us:w-28 us:h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40"
                        isProgress = {isLoadingAvatar}
                        src={avatar}
                    />
                    <div className='flex text-xl sm:text-2xl md:text-3xl font-bold text-sky-700 gap-2'>
                        <span>{firstName} {lastName}</span>
                    </div>
                </div>
            </div>
            <div className=' grow h-12'></div>    
            <div className=' flex justify-center gap-5'>
                <ButtonUnderline
                    title='People'
                    isActive={location.pathname === RoutePath.HOME+RoutePath.USER}
                    onClick={()=>{navigate(RoutePath.HOME+RoutePath.USER)}}
                />
                <ButtonUnderline
                    title='My Posts'
                    isActive={location.pathname === RoutePath.HOME+RoutePath.USER + '/' + RoutePath.MY_POSTS}
                    onClick={()=>{navigate(RoutePath.MY_POSTS)}}
                />
                <ButtonUnderline
                    title='All Posts'
                    isActive={location.pathname === RoutePath.HOME + RoutePath.USER+ '/' + RoutePath.POSTS}
                    onClick={()=>{navigate(RoutePath.POSTS)}}
                />
                <div className="relative self-end block md:hidden">
                        <button className=""
                            onClick={(e) => handleOpen(e)}
                        >
                            <EllipsisHorizontalIcon className="h-9"/>
                        </button>
                        <Tooltip 
                            className='right-0 top-[110%]'
                            isOpen={isOpen}  
                        >
                            <ul>
                                <MenuItem
                                    itemName={RoutePath.INVITATIONS}
                                    itemText={'Invitations'}
                                    onChange={handleMove}
                                />              
                                <MenuItem
                                    itemName={RoutePath.SUGGESTATIONS}
                                    itemText={'Suggestations'}
                                    onChange={handleMove}
                                />              
                                <MenuItem
                                    itemName={RoutePath.FRIENDS}
                                    itemText={'Friends'}
                                    onChange={handleMove}
                                />              
                            </ul>
                        </Tooltip>
                    </div>
            </div>    
        </div>
    </div>
  )
}
