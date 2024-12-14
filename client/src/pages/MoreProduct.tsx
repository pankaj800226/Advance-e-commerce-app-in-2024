import { FaHeart } from "react-icons/fa";
import details from "../assets/details.png";
import { motion } from "framer-motion";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useState, ChangeEvent, useEffect } from "react";
import axios from "axios";
import { api } from "../Api";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Loading from "../components/Loading";

const PRODUCTS_PER_PAGE = 8;

interface Product {
  _id: string;
  productName: string;
  price: string;
  photo: string;
  discountPrice: string
}

const MoreProduct = () => {
  const [page, setPage] = useState(1);
  const [categories, setCategory] = useState<string>("");
  const [productSearches, setProductSearches] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number>(2000000); // max price value
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);


  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("TOKEN");
  const handleChange = (_: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  // Fetch products from the server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${api}/productFind`);
        setAllProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  // Apply filters whenever search, category, or price changes
  useEffect(() => {
    const filtered = allProducts.filter((product) => {
      const matchesSearch = product.productName
        .toLowerCase()
        .includes(productSearches.toLowerCase());

      const matchesCategory =
        categories === "" || product.productName.includes(categories);

      const matchesPrice = parseFloat(product.price) <= priceRange;

      return matchesSearch && matchesCategory && matchesPrice;
    });
    setFilteredProducts(filtered);

    if (productSearches.trim() !== "") {
      const suggestionList = allProducts.filter((product) =>
        product.productName.toLowerCase().includes(productSearches.toLowerCase())
      )
        .map((product) => product.productName)
      setSuggestions(suggestionList)
    } else {
      setSuggestions([]);

    }


  }, [productSearches, categories, priceRange, allProducts]);

  const categoryOptions = [
    "Lehenga",
    "Kurta",
    "T-shirt",
    "Suit Salwar",
    "Fashion",
    "Saree"
  ];

  const handleWishlist = async (productId: string) => {
    try {
      const response = await axios.post(`${api}/wishlist`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

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
  }
  return (
    <div className="more_product">
      <div className="more_sideBar">
        <h2>Filter Section</h2>
        <div className="filterSection">
          {/* Search Input */}
          <div className="input">
            <input
              type="text"
              placeholder="Search Products"
              value={productSearches}
              onChange={(e) => setProductSearches(e.target.value)}
              onClick={() => setShowSuggestions(true)}
            />

            {/* Dropdown for Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <select
                size={5}
                onChange={(e) => {
                  setProductSearches(e.target.value);
                  setShowSuggestions(false);
                }}

                onBlur={() => setShowSuggestions(false)}
                className="suggestions_dropdown"

              >

                {suggestions.map((suggestion, index) => (
                  <option key={index} value={suggestion}>
                    {suggestion}
                  </option>
                ))}

              </select>
            )}
          </div>

          {/* Price Range Input */}
          <div className="price_range">
            <label>Price: ₹0 - ₹{priceRange}</label>
            <input
              type="range"
              min={0}
              max={2000000}
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="progresh_baar"
              title={priceRange.toString()}
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={categories}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a Category</option>
            {categoryOptions.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* All Product Section */}
      <motion.div
        className="more_right"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {
          loading ? (
            <Loading />
          ) : currentProducts.length === 0 ? (
            <h2>Product Not Found</h2>

          ) : (

            currentProducts.map((product) => (
              <div className="home_section" key={product._id}>
                <div>
                  <img
                    src={`${api}/photo/${product.photo[0]}`}
                    alt={product.productName}
                  />
                </div>
                <h3>{product.productName}</h3>
                {/* <p>₹{product.price}</p> */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <p>₹{product.price}</p>
                  <del>₹{product.discountPrice}</del>
                </div>

                <div className="icons">
                  <FaHeart onClick={() => handleWishlist(product._id)} className="wishlist" title="Wishlist" color="red" />


                  <Link to={`/productDetails/${product._id}`}>
                    <img src={details} alt="details" title="Product Details" />
                  </Link>
                </div>
              </div>
            ))
          )
        }


        <Stack spacing={2} className="pagination_stack">
          <Pagination
            count={Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)}
            page={page}
            onChange={handleChange}
            color="secondary"
          />
        </Stack>
      </motion.div>
    </div>
  );
};

export default MoreProduct;
