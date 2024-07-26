import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { setToken, setUser } from "../redux/auth";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";

function Login() {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ rememberMe, setRememberMe ] = useState(false);
    const [ showPwd, setShowPwd ] = useState(false);
    const [ usernameFilled, setUsernameFilled ] = useState(false);
    const [ usernameFocus, setUsernameFocus ] = useState(false);
    const [ passwordFilled, setPasswordFilled ] = useState(false);
    const [ passwordFocus, setPasswordFocus ] = useState(false);
    const [ isSubmitting, setIsSubmitting] = useState(false);
    const [ error, setError ] = useState([]);
    const passwordRef = useRef(null);

    const dispatch = useDispatch();

    useEffect(() => {
        username && setUsernameFilled(true);
        password && setPasswordFilled(true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    function usernameHandler(e) {
        setUsername(e.target.value);
    }

    function passwordHandler(e) {
        setPassword(e.target.value);
    }

    function rememberMeHandler(e) {
        setRememberMe(e.target.checked);
    }

    function toggleShowPwd() {
        setShowPwd(!showPwd);
        setTimeout(() => {
            passwordRef.current.setSelectionRange(password.length, password.length);
            passwordRef.current.focus();
        }, 0);
    }

    function usernameFocusHandler() {
        setUsernameFocus(true);
        setUsernameFilled(true);
    }

    function usernameBlurHandler() {
        setUsernameFocus(false);
        !username && setUsernameFilled(false);
    }

    function passwordFocusHandler() {
        setPasswordFocus(true);
        setPasswordFilled(true);
    }

    function passwordBlurHandler() {
        setPasswordFocus(false);
        !password && setPasswordFilled(false);
    }

    function submitHandler(e) {
        e.preventDefault();
        setIsSubmitting(true);
        setError([]);
        axios.post(
            `${process.env.REACT_APP_API}/api/users/login`,
            {username, pwd: password, rememberMe},
            {headers: {"Content-Type": "application/json"}, withCredentials: true}
        ).then(function (data) {
            setIsSubmitting(false);
            const response = data.data;
            if (response.error) {
                toast.error(response.error);
            } else if (response.formError) {
                typeof (response.formError) === "string" ? setError([response.formError]) : setError(response.formError);
            } else if (response.success) {
                dispatch(setToken(response.token));
                dispatch(setUser(response.user));
                toast.success("Anda berhasil masuk");
            } else {
                toast.error("Request yang buruk");
            }
        }).catch(function (error) {
            setIsSubmitting(false);
            toast.error("Request yang buruk");
        });
    }

    const usernameLabelClass = "inputLabel" + (usernameFocus ? " focus" : "") + (usernameFilled ? " filled" : "");
    const passwordLabelClass = "inputLabel" + (passwordFocus ? " focus" : "") + (passwordFilled ? " filled" : "");

    return (
        <div className="login">
            <form onSubmit={submitHandler} className="loginForm" autoComplete="off" spellCheck="off">
                <h1 className="loginHeader">Login</h1>
                <div className="inputBox">
                    <input
                        value={username}
                        onChange={usernameHandler}
                        onFocus={usernameFocusHandler}
                        onBlur={usernameBlurHandler}
                        type="text"
                        className="inputField"
                        id="username"
                        disabled={isSubmitting}
                        required={true}
                    />
                    <label htmlFor="username" className={usernameLabelClass}>Username</label>
                </div>
                <div className="inputBox">
                    <input
                        value={password}
                        onChange={passwordHandler}
                        onFocus={passwordFocusHandler}
                        onBlur={passwordBlurHandler}
                        ref={passwordRef}
                        type={showPwd ? "text" : "password"}
                        className="inputField password"
                        id="pwd"
                        disabled={isSubmitting}
                        required={true}
                    />
                    <label htmlFor="pwd" className={passwordLabelClass}>Password</label>
                    {showPwd ? <FaEye onClick={toggleShowPwd} className="pwdSuffix" /> : <FaEyeSlash onClick={toggleShowPwd} className="pwdSuffix" />}
                </div>
                {
                    error.length
                    ? <div className="errors">
                        {error.map((err, i) => <small key={i} className="error">{err}</small>)}
                    </div>
                    : ""
                }
                <div className="rememberMeBox">
                    <input
                        checked={rememberMe}
                        onChange={rememberMeHandler}
                        type="checkbox"
                        className="inputCheckbox"
                        id="rememberMe"
                        disabled={isSubmitting}
                    />
                    <label htmlFor="rememberMe" className="inputCheckboxLabel">Ingat saya</label>
                </div>
                <button disabled={isSubmitting} className="loginBtn">
                    {isSubmitting ? <ThreeDots height="15" width="26" color="var(--three-dots-color-)" /> : "Masuk"}
                </button>
            </form>
        </div>
    );
}

export default Login;