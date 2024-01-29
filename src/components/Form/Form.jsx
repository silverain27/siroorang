import React from 'react'
import * as style from "./LoginStyle";
import { useFormAction } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import TopBanner from "../../components/TopBanner/TopBanner";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const Form = ({ title, getDataForm, firebaseError }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm(
        {
            mode: 'onChange'
        }
    )

    const onSubmit = ({ email, password }) => {
        console.log(email, password)
        getDataForm(email, password)
        reset()
    }
    const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    const userEmail = {
        required: "필수 필드입니다.",
        pattern : emailRegex
    }
    const userPassword = {
        required: "필수 필드입니다.",
        minLength: {
            value: 6,
            message: "최소 6자입니다."
        }
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <TopBanner />
                <Header isAboutHeader={true} />
                <style.Login>
                    <div className="section_path">
                        <ol>
                            <li>
                                <a href="/">홈</a>
                            </li>
                            <li>
                                <strong>{title}</strong>
                            </li>
                        </ol>
                    </div>
                    <div className="title_area">
                        <h2>{title}</h2>
                    </div>
                    <div className="login_form">
                        <div className="login">
                            <input
                                type="email"
                                placeholder="아이디"
                                {...register("email", userEmail)}
                            />
                            {errors?.email?.type == "required" &&
                                <div>
                                    <style.Error>
                                        {console.log("error----:", errors)}
                                        {"이메일을 입력해주세요"}
                                    </style.Error>
                                    
                                </div>
                            }
                            {errors?.email?.type == "pattern" &&
                                <div>
                                    <style.Error>
                                        {console.log("error----:", errors)}
                                        {"이메일 양식에 맞게 입력해주세요"}
                                    </style.Error>
                                    
                                </div>
                            }
                            <input
                                type="password"
                                placeholder="비밀번호"
                                {...register("password", userPassword)}
                            />
                            {errors?.password &&
                                <div>
                                    <style.Error>
                                        {console.log("error----:", errors)}
                                        {errors.password.message}
                                    </style.Error>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="security">
                        <div className="login_security">
                            <span>
                                <input type="checkbox" /> &nbsp;
                            </span>
                            <label>보안접속</label>
                        </div>
                    </div>
                    <div className="login_btn">
                        <button>{title}</button>
                        {firebaseError && (
                            <span> {firebaseError}</span>
                        )}
                    </div>

                    <div class="wrap_find">
                        <div>
                            <a href="/">아이디 찾기</a>
                        </div>
                        <div>
                            <a href="/">비밀번호 찾기</a>
                        </div>
                    </div>
                    <div class="login__util">
                        <div>아직 회원이 아니신가요?</div>
                        <div>
                            지금 회원가입을 하시면<br></br>다양하고 특별한 혜택이 준비되어
                            있습니다.
                        </div>
                        <div>
                            <button>회원가입</button>
                        </div>
                    </div>
                    <div class="login_sns">
                        <div class="sns">SNS 로그인</div>
                        <div class="wrap_sns_log">
                            <button class="btnKakao">카카오 로그인</button>
                            <button class="btnNaver">네이버 로그인</button>
                            <button class="btnApple">Apple로 로그인</button>
                        </div>
                    </div>
                </style.Login>
                <Footer />

            </div>

        </form>

    )
}

export default Form