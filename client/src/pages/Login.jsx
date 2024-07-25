import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import BeatLoader from "react-spinners/BeatLoader";
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
    const passwordRef = useRef(null);

    const theme = useSelector((state) => state.theme.mode) || "light";

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
        axios.post(
            `${process.env.REACT_APP_API}/api/users/login`,
            {username, pwd: password, rememberMe},
            {headers: {"Content-Type": "application/json"}}
        ).then(function (data) {
            toast.success("Success", {
                className: "toastSuccess"
            });
            console.log(data);
        }).catch(function (error) {
            console.log(error);
        });
    }

    const usernameLabelClass = "inputLabel" + (usernameFocus ? " focus" : "") + (usernameFilled ? " filled" : "");
    const passwordLabelClass = "inputLabel" + (passwordFocus ? " focus" : "") + (passwordFilled ? " filled" : "");

    return (
        <div className={"login"}>
            <form onSubmit={submitHandler} className={"loginForm"} autoComplete="off" spellCheck="off">
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
                        // required={true}
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
                        // required={true}
                    />
                    <label htmlFor="pwd" className={passwordLabelClass}>Password</label>
                    {showPwd ? <FaEye onClick={toggleShowPwd} className="pwdSuffix" /> : <FaEyeSlash onClick={toggleShowPwd} className="pwdSuffix" />}
                </div>
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
                <button disabled={isSubmitting} className={`${theme} loginBtn`}>
                    {isSubmitting ? <BeatLoader size={8} color={"var(--beat-loader-color-)"} /> : "Masuk"}
                </button>
            </form>
        </div>
    );
}

export default Login;