import { motion } from "framer-motion";
import SideBar from "../components/SideBar";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { api } from "../Api";
import { useParams } from "react-router-dom";

const Edit = () => {
  const [categories, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [discountPrice, setDiscountPrice] = useState<string>('')
  const [dressSizes, setDressSizes] = useState<string[]>([]);
  const [dressColor, setDressColor] = useState<string[]>([])



  const { id } = useParams();

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    // Handle form submission logic
    try {
      await axios.put(`${api}/edit/${id}`, {
        productName,
        price,
        discountPrice,
        stock,
        categories,
        dressSizes,
        dressColor
      });
      toast.success("Product uploaded successfully!");
    } catch (error) {
      console.log(error);
      toast.error(`error: ${error}`);
    }
  };

  useEffect(() => {
    const fetchIdProduct = async () => {
      try {
        const res = await axios.post(`${api}/productFindById/${id}`);
        setProductName(res.data.productName);
        setPrice(res.data.price);
        setStock(res.data.stock);
        setCategory(res.data.categories);
        setDiscountPrice(res.data.discountPrice);
        setDressSizes(res.data.dressSizes)
        setDressColor(res.data.dressColor)
      } catch (error) {
        console.log(error);
      }
    };
    fetchIdProduct();
  }, [id]);

  const categoryOptions = [
    "Lehenga",
    "Kurta",
    "T-shirt",
    "Suit Salwar",
    "Fashion",
  ];

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
  const colorOPtion = ['red', 'green', 'yellow', 'black', 'white']



  const handleSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedSize = Array.from(e.target.selectedOptions, option => option.value)
    setDressSizes(selectedSize)
  }

  const handleColorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectColors = Array.from(e.target.selectedOptions, option => option.value);
    setDressColor(selectColors);
  }



  return (
    <div className="dashboard_container">
      <SideBar />
      <main>
        <div className="upload-container">
          <motion.div
            className="upload-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h2 className="upload-title">Edit Product</h2>
            <form onSubmit={handleUpload} className="upload-form">
              <div className="input-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Discount Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Stock</label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />

              </div>
              <div className="input-group">
                <label>Category</label>
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

              <div className="input-group">
                <label>Dress Size</label>
                <select
                  multiple
                  value={dressSizes}
                  onChange={handleSizeChange}
                  required
                >
                  {sizeOptions.map((size, index) => (
                    <option key={index} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Dress Size</label>
                <select
                  multiple
                  value={dressColor}
                  onChange={handleColorChange}
                  required
                >
                  {colorOPtion.map((color, index) => (
                    <option key={index} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>

              <motion.button
                type="submit"
                className="upload-button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Edit
              </motion.button>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Edit;
