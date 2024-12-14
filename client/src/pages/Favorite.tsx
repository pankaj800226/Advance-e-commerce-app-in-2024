import axios from "axios";
import { useEffect, useState } from "react";
import { api } from "../Api";
import { motion } from 'framer-motion'
import { Link } from "react-router-dom";
interface Product {
  _id: string;
  productName: string;
  photo: string[];
  price: number;
  discountPrice: number;
}

interface WishlistItem {
  productId: Product;
}

interface WishlistResponse {
  items: WishlistItem[];
}

const Favorite = () => {
  const [wishlist, setWishlist] = useState<WishlistResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("TOKEN");

  useEffect(() => {
    const fetchedWishlist = async () => {
      try {
        const response = await axios.post<WishlistResponse>(
          `${api}/wishlistGet`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlist(response.data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchedWishlist();
  }, [token]);

  if (loading) {
    return <div className="loader">Loading...</div>;
  }




  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="wishlist_container">
      {wishlist?.items.length === 0 ? (
        <h1>Wishlist is empty</h1>
      ) : (
        wishlist?.items.map((wishlistItem, index) => (
          <Link to={`/productDetails/${wishlistItem.productId._id}`}>
            <div key={index} className="wishlist_card">
              <img
                src={`${api}/photo/${wishlistItem.productId.photo[0]}`}
                alt={wishlistItem.productId.productName}
                className="wishlist_image"
              />
              <h1 className="wishlist_product_name">
                {wishlistItem.productId.productName}
              </h1>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "center"
              }}>
                <p style={{ color: "crimson" }}>₹{wishlistItem.productId.price}</p>
                <del>₹{wishlistItem.productId.discountPrice}</del>
              </div>
            </div>
          </Link>
        ))
      )}
    </motion.div>
  );
};

export default Favorite;
