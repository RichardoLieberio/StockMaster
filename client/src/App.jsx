import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import { setMode } from "./redux/theme";

import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  const [ firstRender, setFirstRender ] = useState(true);

  const theme = useSelector((state) => state.theme.mode) || "light";
  const dispatch = useDispatch();

  useEffect(() => {
    if (firstRender) {
      const theme = Cookies.get(process.env.REACT_APP_THEME);
      theme ? dispatch(setMode(theme)) : Cookies.set(process.env.REACT_APP_THEME, "light");
      setFirstRender(false);
    }
  }, [firstRender]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={theme}>
      <ToastContainer limit={1} position="top-center" theme="colored" />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;