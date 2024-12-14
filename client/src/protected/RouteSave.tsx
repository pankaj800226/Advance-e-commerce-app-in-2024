import { Navigate, Outlet } from "react-router-dom";

const RouteSave = () => {
  const token = localStorage.getItem("TOKEN");
  return token ? <Outlet /> : <Navigate to={"/login"} />;
};

export default RouteSave;
