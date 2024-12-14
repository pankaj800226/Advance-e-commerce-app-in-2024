import React, { Suspense, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Footer from "./components/Footer";
import Loading from "./components/Loading";
import Header from "./components/Header";
const Home = React.lazy(() => import("./pages/Home"));
const Register = React.lazy(() => import("./components/Register"));
const Login = React.lazy(() => import("./components/Login"));
const SideBar = React.lazy(() => import("./components/SideBar"));
const Upload = React.lazy(() => import("./pages/Upload"));
import RouteSave from "./protected/RouteSave";
const Manage = React.lazy(() => import("./pages/Manage"));
const Edit = React.lazy(() => import("./pages/Edit"));
const Order = React.lazy(() => import("./pages/Order"));
const Feedback = React.lazy(() => import("./pages/Feedback"));




// style component
import "./styles/app.scss";
import "./styles/home.scss";
import "./styles/header.scss";
import "./styles/register.scss";
import "./styles/upload.scss";
import "./styles/manage.scss";
import "./styles/feedback.scss";


const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  return (
    <>
      <Router>
        <Header />
        <Suspense fallback={<Loading />}>
          {loading ? (
            <Loading />
          ) : (
            <Routes>
              <Route element={<RouteSave />}>
                <Route path="/" element={<Home />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/manage" element={<Manage />} />
                <Route path="/edit/:id" element={<Edit />} />
                <Route path="/order" element={<Order />} />
                <Route path="/feedback" element={<Feedback />} />


              </Route>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/sidebar" element={<SideBar />} />
            </Routes>
          )}
        </Suspense>

        <ToastContainer />
        {/* <Footer /> */}
      </Router>
    </>
  );
};

export default App;
