import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../firebase';

const Register = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault()

        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                navigate("/home")
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                // ..
            });


    }

    return (
        <div className={'mainContainer'}>
            <div className={'titleContainer'}>
                 <div> Register</div>
                     </div>
                            <div className={'inputContainer'}>
                                <input
                                    type="email"
                                    label="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Email address"
                                    className={'inputBox'}
                                />
                            </div>
                            <br/>
                            <div className={'inputContainer'}>
                                <input
                                    type="password"
                                    label="Create password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Password"
                                    className={'inputBox'}
                                />
                            </div>
                            <br/>
                            <button
                                type="submit"
                                className={'buttonContainer'}
                                onClick={onSubmit}
                            >
                                Sign up
                            </button>

                        <p>
                            Already have an account?{' '}
                            <NavLink to="/" >
                                Sign in
                            </NavLink>
                        </p>
        </div>

    )
}

export default Register;
