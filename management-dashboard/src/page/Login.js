import React, {useEffect, useState} from 'react';
import {onAuthStateChanged, signInWithEmailAndPassword} from 'firebase/auth';
import { auth } from '../firebase';
import { NavLink, useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setloginError] = useState('');


    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                navigate("/")
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                setloginError(errorMessage);
            });

    }

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/");
            }
        });
    }, [])

    return(
        <div className={'mainContainer'}>
            <div className={'titleContainer'}>
                <div>Login</div>
            </div>
            <br/>
            <div className={'inputContainer'}>
                <input
                    id="email-address"
                    name="email"
                    type="email"
                    required
                    placeholder="Email address"
                    onChange={(e) => setEmail(e.target.value)}
                    className={'inputBox'}
                />
            </div>
            <br/>
            <div className={'inputContainer'}>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className={'inputBox'}
                />
            </div>
            <label className={'errorLabel'}>
                {loginError}
            </label>
            <br/>
            <div>
                <button
                    onClick={onLogin}
                    className={'buttonContainer'}
                >
                    Login
                </button>
            </div>


            <p>
                No account yet? {' '}
                <NavLink to="/register">
                    Sign up
                </NavLink>
            </p>

        </div>
    )
}

export default Login;
