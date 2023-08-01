import {io} from 'socket.io-client'
import { LocalStorageNames } from './enums/LocalStorageEnums'


export const URL = `${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/`

export const socket = io(URL, {auth:{
    user: localStorage.getItem(LocalStorageNames.CURRENT_USER)
  }})

