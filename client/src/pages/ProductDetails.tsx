import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { api } from "../Api";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { FaCartPlus } from "react-icons/fa";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Rating from "@mui/material/Rating";
import RatingSystem from "./RatingSystem";

interface Product {
  _id: string;
  productName: string;
  price: string;
  photo: string[];
  dressSizes: string[];
  dressColor: string[]
  discountPrice: string;
}

const ProductDetails = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [newComment, setNewComment] = useState<string>("");
  const [ratingValue, setRatingValue] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectColor, setSelectColor] = useState<string | null>(null)

  const { id } = useParams();
  const token = localStorage.getItem("TOKEN");

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const response = await axios.post(`${api}/productFindById/${id}`);
        setProduct(response.data);
        setActiveImage(response.data.photo?.[0] || "");
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProductById();
  }, [id]);

  // add to cart
  const handleAddToCart = async () => {
    try {
      if (!token) {
        toast(`Please login to add items to the cart.`, {
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
        return;
      }

      if (!selectedSize) {
        toast(`Please select a size.`, {
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
        return;
      }

      if (!selectColor) {
        toast(`Please select a color.`, {
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
        return;
      }

      const response = await axios.post(
        `${api}/addToCart`,
        { productId: product?._id, quantity: 1, size: selectedSize, color: selectColor },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast(`add to cart successfully.`, {
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
      toast(`Failed to add product to cart.`, {
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

  // rating
  const handleRating = async (e: FormEvent) => {
    e.preventDefault();
    if (ratingValue && newComment) {
      try {
        const response = await axios.post(
          `${api}/rating/comment/${id}`,
          { comment: newComment, rating: ratingValue },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 201) {
          toast(`!Thank You For Rating.`, {
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
          setNewComment("");
          setRatingValue(null);
          setOpen(false);
        }
      } catch (error) {
        toast(`${error}`, {
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
    } else {
      toast(`All fields are required.`, {
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

  if (!product) return <h2>Loading Product Details...</h2>;

  // const colorOPtion = ['red', 'green', 'yellow', 'black', 'white']

  const dressColorStatus = (color: string) => {
    switch (color) {
      case "red":
        return "red";
      case "green":
        return "green";
      case "yellow":
        return "yellow";
      case "black":
        return "black";
      case "white":
        return "white";
      default:
        return "gray";

    }
  }

  return (
    <motion.div
      className="product-details-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="product-image-section">
        {product.photo?.length > 0 ? (
          <>
            <img
              src={`${api}/photo/${activeImage}`}
              alt={product.productName}
              className="main-image"
            />
            <div className="thumbnail-container">
              {product.photo.map((img, index) => (
                <img
                  src={`${api}/photo/${img}`}
                  key={index}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail ${activeImage === img ? "active-thumbnail" : ""}`}
                  onMouseEnter={() => setActiveImage(img)}
                />
              ))}
            </div>
          </>
        ) : (
          <p>No images available</p>
        )}
      </div>

      <div className="product-info-section">
        <h2>{product.productName}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <p>₹{product.price}</p>
          <del>₹{product.discountPrice}</del>
        </div>

        {/* dress size  */}
        <div className="size-selection">
          <label>Select Size: </label>
          <div className="size-options">
            {product.dressSizes?.map((size) => (
              <button
                key={size}
                className={`size-button ${selectedSize === size ? "selected" : ""}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* dressColor  */}
        <div className="size-selection">
          <label>Select Color: </label>
          <div className="size-options">
            {product.dressColor?.map((color) => (
              <button
                key={color}
                className={`size-button ${selectColor === color ? "selected" : ""}`}
                onClick={() => setSelectColor(color)}
                style={{ backgroundColor: dressColorStatus(color) }}
              >
                {/* {color} */}
                {/* style={{ backgroundColor: dressColorStatus(color) }} */}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Button variant="outlined" onClick={handleClickOpen}>
            Rate Product
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Rate System</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <Rating
                  name="product-rating"
                  value={ratingValue}
                  onChange={(_, newValue) => setRatingValue(newValue)}
                />
              </DialogContentText>
              <TextField
                autoFocus
                required
                margin="dense"
                label="Comment"
                type="text"
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">Cancel</Button>
              <Button onClick={handleRating} color="primary">Submit</Button>
            </DialogActions>
          </Dialog>
        </div>

        <div className="product-actions">
          <button onClick={handleAddToCart}>
            <FaCartPlus /> <span>Add To Cart</span>
          </button>
        </div>
      </div>
      <RatingSystem />
    </motion.div >
  );
};

export default ProductDetails;
