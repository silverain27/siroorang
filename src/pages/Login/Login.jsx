
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Form from './../../components/Form/Form';
import app from "../../firebase";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import {useDispatch} from 'react-redux'
import { setUserId } from "../../store/cart/cart";
import { setUser } from "../../store/user/user";

 
function Login() {
  const navigate = useNavigate()
  const [firebaseError, setFirebaseError] = useState("")
  const auth = getAuth(app)
  const dispatch = useDispatch()
  const handleLogin = (email, password) =>{
    signInWithEmailAndPassword(auth, email, password)
    .then(userCredential=>{
      dispatch(setUser({
        email :userCredential.user.email,
        token :userCredential.user.refreshToken,
        id : userCredential.user.uid
      }))
      dispatch(setUserId(userCredential.user.uid))
      navigate('/')
    })
    .catch(error=>{
      return error && setFirebaseError("이메일 또는 패스워드가 잘못되었습니다 ")
    })
}
  return (
    <Form
        title={"로그인"}
        getDataForm={handleLogin}
        firebaseError={firebaseError}
    />
  );
}

export default Login;
