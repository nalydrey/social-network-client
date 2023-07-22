import axios from "axios";
import { URL } from "./http";
import { LocalStorageNames } from "./enums/LocalStorageEnums";

const instance = axios.create({
    baseURL: URL + 'api',
}) 

instance.interceptors.request.use(config => {
    config.headers.Authorization = localStorage.getItem(LocalStorageNames.TOKEN)
    return config
})

export default instance