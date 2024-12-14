import { motion } from "framer-motion";
import SideBar from "../components/SideBar";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { api } from "../Api";

const Upload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [categories, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [discountPrice, setDiscountPrice] = useState<string>("");
  const [dressSizes, setDressSizes] = useState<string[]>([]);
  const [dressColor, setDressColor] = useState<string[]>([])

  console.log(dressColor);

  const token = localStorage.getItem("TOKEN");

  const categoryOptions = [
    "Lehenga",
    "Kurta",
    "T-shirt",
    "Suit Salwar",
    "Fashion",
    "Saree",

  ];

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
  const colorOPtion = ['red', 'green', 'yellow', 'black', 'white']

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) => file.size < 5 * 1024 * 1024 // Files smaller than 5MB
    );

    if (validFiles.length < selectedFiles.length) {
      toast.error("Some files are larger than 5MB and were not added.");
    }

    setFiles(validFiles);
  };

  const handleSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedSizes = Array.from(e.target.selectedOptions, option => option.value);
    setDressSizes(selectedSizes);
  };

  const handleColorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectColors = Array.from(e.target.selectedOptions, option => option.value);
    setDressColor(selectColors);
  }


  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();

    if (!productName || !price || !stock || !categories || !discountPrice || dressSizes.length === 0 || dressColor.length === 0 || files.length === 0) {
      toast("Please fill all fields and upload at least one image.");
      return;
    }

    const formData = new FormData();
    formData.append("categories", categories);
    formData.append("productName", productName);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("discountPrice", discountPrice);


    dressSizes.forEach((size) => formData.append("dressSizes", size));
    dressColor.forEach((color) => formData.append("dressColor", color));

    files.forEach((file) => formData.append("files", file));

    try {
      const res = await axios.post(`${api}/uploadProduct`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Product uploaded successfully!");
      console.log(res);

      // Clear the form after upload
      setProductName("");
      setPrice("");
      setStock("");
      setCategory("");
      setDiscountPrice("");
      setDressSizes([]);
      setFiles([]);
      setDressColor([])
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload product.");
    }
  };

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
            <h2 className="upload-title">Manage Product</h2>
            <form onSubmit={handleUpload} className="upload-form">
              {/* Product Name */}
              <div className="input-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              {/* Price */}
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

              {/* Stock */}
              <div className="input-group">
                <label>Stock</label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              {/* File Upload */}
              <div className="input-group">
                <label>Upload Files</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  accept="image/*"
                />
              </div>

              {/* Category Selection */}
              <div className="input-group">
                <label>Category</label>
                <select
                  value={categories}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a Category</option>
                  {categoryOptions.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dress Size (Multiple Select) */}
              <div className="input-group">
                <label>Dress Size</label>
                <select
                  multiple
                  value={dressSizes}
                  onChange={handleSizeChange}
                >
                  {sizeOptions.map((size, index) => (
                    <option key={index} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Dress Color</label>
                <select
                  multiple
                  value={dressColor}
                  onChange={handleColorChange}
                >
                  {colorOPtion.map((color, index) => (
                    <option key={index} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="upload-button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Upload
              </motion.button>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Upload;
