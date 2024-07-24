import { useSelector } from "react-redux";

function Login() {
    const theme = useSelector((state) => state.theme.mode) || "light";

    return (
        <div className={`${theme} login`}>
            <form className={`${theme} loginForm`}>
                <h1>Hello</h1>
            </form>
        </div>
    );
}

export default Login;