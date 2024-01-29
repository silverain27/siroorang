import { useAppSelector } from "./redux";
import { userSlice } from './../store/user/user.slice';

export function  useAuth(){
    const {id, email, token} = useAppSelector((state)=> state.userSlice)

    // !!email 뱅뱅 
    return {
        isAuth : !!email,
        email,
        id,
        token
    }
}