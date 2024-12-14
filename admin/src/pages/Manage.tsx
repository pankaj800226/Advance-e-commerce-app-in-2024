import { motion } from "framer-motion";
import SideBar from "../components/SideBar";
import { ChangeEvent, useEffect, useState } from "react";
import { MenuItem, CircularProgress } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import remove from "../assets/delete.png";
import edit from "../assets/edit.png";
import axios from "axios";
import { api } from "../Api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const PRODUCTS_PER_PAGE = 4;

interface Product {
  productName: string;
  price: string;
  stock: string;
  photo: string[];
  _id: string;
  discountPrice: string;
}

const Manage = () => {
  const [page, setPage] = useState(1);
  const [allProduct, setAllProduct] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (_: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Calculate the start and end index of the products to display on the current page
  const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = allProduct.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${api}/productFind`);
        setAllProduct(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const productDeleteHandler = async (id: string) => {
    try {
      await axios.delete(`${api}/productDelete/${id}`);
      setAllProduct((prevData) => prevData.filter((product) => product._id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="dashboard_container">
      <SideBar />
      <main>
        <motion.div
          className="manage-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="manage-title">Product Management</h2>
          {loading ? (
            <div className="loading-container">
              <CircularProgress />
            </div>
          ) : (
            <table className="product-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Discount Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product, index) => (
                  <motion.tr
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <td>{product._id}</td>
                    <td>
                      <img
                        src={product.photo[0] ? `${api}/photo/${product.photo[0]}` : "/path/to/fallback.png"}
                        alt={product.productName}
                      />
                    </td>
                    <td>{product.productName}</td>
                    <td>${product.price}</td>
                    <td>
                      <del style={{ color: "crimson" }}>${product.discountPrice}</del>
                    </td>
                    <td>{product.stock}</td>
                    <td>
                      <Link to={`/edit/${product._id}`}>
                        <button className="edit-btn">
                          <MenuItem>
                            <img src={edit} alt="edit" />
                          </MenuItem>
                        </button>
                      </Link>
                      <button
                        className="edit-btn"
                        onClick={() => productDeleteHandler(product._id)}
                      >
                        <MenuItem>
                          <img src={remove} alt="remove" />
                        </MenuItem>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination Section */}
          <Stack spacing={2} className="pagination_stack">
            <Pagination
              count={Math.ceil(allProduct.length / PRODUCTS_PER_PAGE)}
              page={page}
              onChange={handleChange}
              color="secondary"
            />
          </Stack>
        </motion.div>
      </main>
    </div>
  );
};

export default Manage;
