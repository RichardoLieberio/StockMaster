import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

import { setMode } from "./redux/theme";
import { setToken, setUser } from "./redux/auth";

import Loading from "./pages/Loading";
import Gudang from "./pages/Gudang";
import Login from "./pages/Login";

function App() {
  const [ firstRender, setFirstRender ] = useState(true);

  const theme = useSelector((state) => state.theme.mode) || "light";
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (firstRender) {
      const theme = Cookies.get(process.env.REACT_APP_THEME);
      theme ? dispatch(setMode(theme)) : Cookies.set(process.env.REACT_APP_THEME, "light");
      axios.get(`${process.env.REACT_APP_API}/api/token`, {withCredentials: true})
        .then(function (data) {
          setFirstRender(false);
          const response = data.data;
          if (response.authError) {
            toast.error(response.authError);
          } else if (response.token) {
            dispatch(setToken(response.token));
            dispatch(setUser(response.user));
          } else if (!response.error) {
            toast.error("Request yang buruk");
          }
        })
        .catch(function (error) {
          setFirstRender(false);
          toast.error("Request yang buruk");
        });
    }
  }, [firstRender]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={theme}>
      <ToastContainer position="top-center" theme="colored" pauseOnHover={false} draggable={true} />
      {
        firstRender
        ? <Loading />
        : <Router>
          <Routes>
            <Route path="/" element={user ? <Gudang /> : <Navigate to="/login" />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          </Routes>
        </Router>
      }
    </div>
  );
}

export default App;