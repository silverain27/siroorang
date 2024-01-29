import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Form from './../../components/Form/Form';
import app from "../../firebase";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
 



function Signup() {
  const navigate = useNavigate()
  const [firebaseError, setFirebaseError] = useState("")
  const auth = getAuth(app)
  const handleLogin = (email, password) =>{
    createUserWithEmailAndPassword(auth, email, password)
    .then((user) =>{
      navigate('/')
    })
    .catch(error=>{
      return error && setFirebaseError("이메일 또는 비밀번호가 잘 못 되었습니다")
    })
  }
  window.scroll({ top: 0, behavior: "auto" });

  return (
    <Form
        title = {"회원가입"}
        getDataForm={handleLogin}
        firebaseError={firebaseError}
    />
  );
}

export default Signup;