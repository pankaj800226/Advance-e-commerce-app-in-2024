import Banner from "./Banner";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import details from "../assets/details.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../Api";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Loading from "../components/Loading";
// import coverVideo from "../video/cover.mp4";
interface Product {
  _id: string;
  productName: string;
  price: string;
  photo: string;
  discountPrice: number
}

const Home = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const token = localStorage.getItem("TOKEN");
  const [loading, setLoading] = useState(true)
  const PRODUCT_PAGE = 4;

  const PRODUCT_SLICE = allProducts.slice(0, PRODUCT_PAGE);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${api}/productFind`,);
        setAllProducts(response.data);
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);




  const handleWishList = async (productId: string) => {
    try {
      const response = await axios.post(
        `${api}/wishlist`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        const message = response.data.action === "removed"
          ? "Product removed from wishlist!"
          : "Product added to wishlist!";

        toast(message, {
          duration: 2000,
          position: "bottom-right",
          icon: "👏",
          iconTheme: {
            primary: "#000",
            secondary: "#fff",
          },
          ariaProps: {
            role: "status",
            "aria-live": "polite",
          },
        });
      }
    } catch (error) {
      console.log(error);

      toast(`${error}Failed to update wishlist.`, {
        duration: 2000,
        position: "bottom-right",
        icon: "👏",
        iconTheme: {
          primary: "#000",
          secondary: "#fff",
        },
        ariaProps: {
          role: "status",
          "aria-live": "polite",
        },
      });
    }
  };

  return (
    <>
      <Banner />
      <div className="home_header">
        <h2>Premium Product</h2>
      </div>

      <motion.div
        className="more_right"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {
          loading ? (
            <Loading />
          ) : PRODUCT_SLICE.length === 0 ? (
            <h1>Product Not Found</h1>
          ) : (
            PRODUCT_SLICE?.map((product, index) => (
              <div className="home_section" key={index}>
                <div>
                  <img
                    src={
                      product.photo.length > 0
                        ? `${api}/photo/${product.photo[0]}`
                        : "https://via.placeholder.com/150"
                    }
                    alt={product.productName}
                  />
                </div>
                <h3>{product.productName}</h3>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <p>₹{product.price}</p>
                  <del>₹{product.discountPrice}</del>
                </div>

                <div className="icons">
                  <FaHeart
                    onClick={() => handleWishList(product._id)}
                    className="wishlist" title="Wishlist" color="red" />


                  <Link to={`/productDetails/${product._id}`}>
                    <img src={details} alt="details" title="Product Details" />
                  </Link>
                </div>
              </div>
            ))
          )
        }
      </motion.div>

      <div className="cover_video">
        {/* <video src={coverVideo} autoPlay></video> */}
      </div>
    </>
  );
};

export default Home;
