import React, { Suspense, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Footer from "./components/Footer";
import Loading from "./components/Loading";
import Header from "./components/Header";
const Home = React.lazy(() => import("./pages/Home"));
const Register = React.lazy(() => import("./components/Register"));
const Login = React.lazy(() => import("./components/Login"));
import RouteSave from "./protected/RouteSave";
const MoreProduct = React.lazy(() => import("./pages/MoreProduct"));
const Cart = React.lazy(() => import("./pages/Cart"));
const ProductDetails = React.lazy(() => import("./pages/ProductDetails"));
const Profile = React.lazy(() => import("./pages/Profile"));
const BuyNow = React.lazy(() => import("./pages/BuyNow"));
const Order = React.lazy(() => import("./pages/Order"));
const Favorite = React.lazy(() => import("./pages/Favorite"));
const PromptForm = React.lazy(() => import("./pages/AiPrompt"));
const Feedback = React.lazy(() => import("./pages/Feedback"));
const Search = React.lazy(() => import("./pages/Search"));

import ButtonMenuBaar from "./components/ButtonMenuBaar";


// style component
import "./styles/app.scss";
import "./styles/home.scss";
import "./styles/header.scss";
import "./styles/register.scss";
import "./styles/banner.scss";
import "./styles/moreProduct.scss";
import "./styles/cart.scss";
import "./styles/productDetails.scss";
import "./styles/Profile.scss";
import "./styles/footer.scss";
import "./styles/buynow.scss";
import "./styles/ratingSystem.scss";
import "./styles/favorite.scss";
import "./styles/ai.scss";
import "./styles/feedback.scss";
import "./styles/buttonMenuBaar.scss";
import "./styles/search.scss";


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
        <div style={{ paddingBottom: "56px" }}>

          <Header />
          <Suspense fallback={<Loading />}>
            {loading ? (
              <Loading />
            ) : (
              <Routes>
                <Route element={<RouteSave />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/more" element={<MoreProduct />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/buynow" element={<BuyNow />} />
                  <Route path="/order" element={<Order />} />
                  <Route path="/favorite" element={<Favorite />} />
                  <Route path="/Aiprompt" element={<PromptForm />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/search" element={<Search />} />


                  <Route
                    path="/productDetails/:id"
                    element={<ProductDetails />}
                  />
                </Route>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            )}
          </Suspense>

          <Toaster />
          <ButtonMenuBaar />
        </div>
        {/* <Footer /> */}
      </Router>
    </>
  );
};

export default App;
