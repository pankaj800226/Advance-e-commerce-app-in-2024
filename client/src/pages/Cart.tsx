import axios from "axios";
import { useEffect, useState } from "react";
import { api } from "../Api";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Button,
  Stack,
} from "@mui/material";
import shippingCart from "../assets/shopping.png";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

interface Product {
  _id: string;
  productName: string;
  price: number;
  photo: string[];
  discountPrice: number;
}

interface CartItem {
  _id: string;
  productId: Product;
  quantity: number;
  size: string;
  color: string;
}

interface Cart {
  items: CartItem[];
}

const Cart = () => {
  const [carts, setCarts] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem("TOKEN");
  const navigate = useNavigate();

  // Function to fetch cart products
  useEffect(() => {
    const fetchCartProduct = async () => {
      try {
        const response = await axios.post(`${api}/getCart`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCarts(response.data);
        setLoading(true);
      } catch (error) {
        toast.error(`${error} error`);
      } finally {
        setLoading(false);
      }
    };

    fetchCartProduct();
  }, [token]);

  // total price calulations
  const calculateTotalPrice = () =>
    carts?.items.reduce(
      (acc, item) => acc + item.productId.discountPrice * item.quantity,
      0
    );

  // increment quantity fron cart
  const incrementQuantity = async (itemId: string) => {
    try {
      const response = await axios.put(
        `${api}/incrementItem/${itemId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setCarts((prevCart) => ({
          ...prevCart,
          items: prevCart!.items.map((item) =>
            item._id === itemId
              ? { ...item, quantity: (item.quantity += 1) }
              : item
          ),
        }));
      }
    } catch (error) {
      toast(`🦄${error}`, {
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
      console.log(error);
    }
  };

  // decrementQuantity for cart
  const decrementQuantity = async (itemId: string) => {
    try {
      const response = await axios.put(
        `${api}/decrementItem/${itemId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setCarts((prevCart) => ({
          ...prevCart,
          items: prevCart!.items.map((item) =>
            item._id === itemId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        }));
      }
    } catch (error) {
      console.error("Error decrementing quantity:", error);
      toast(`🦄${error}`, {
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

  //delete from  cart
  const handleDelete = async (itemId: string) => {
    try {
      const response = await axios.delete(`${api}/cart/removeItem/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        toast(`🦄Items deleted successfully`, {
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

        setCarts((prevCart) => ({
          ...prevCart,
          items: prevCart!.items.filter((item) => item._id !== itemId),
        }));
      } else {
        toast(`🦄Failed to remove item from cart`, {
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
      toast(`🦄${error}`, {
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

  const handleCheckout = () => {
    navigate("/buynow");
  };

  const handleGotoHome = () => {
    navigate("/");
  };

  const cartProductShow = () => {
    if (!carts || carts.items.length === 0) {
      return (
        <>
          <Typography variant="h5" textAlign="center" mt={4}>
            🛒 Your Cart is Empty
          </Typography>
          <div className="empty_cart">
            <img src={shippingCart} alt="" />
            <button onClick={handleGotoHome}>GO TO HOME </button>
          </div>
        </>
      );
    }

    return (
      <Stack spacing={2} sx={{ p: 2 }}>
        {carts.items.map((item) => (
          <Card key={item._id} sx={{ display: "flex", alignItems: "center" }}>
            <CardMedia
              component="img"
              sx={{ width: 150, px: 1, cursor: "pointer" }}
              image={`${api}/photo/${item.productId.photo[0]}`}
              alt={item.productId.productName}
            />
            <Box sx={{ flex: 1, p: 2 }}>
              <CardContent>
                <Typography variant="h6">
                  {item.productId.productName}
                </Typography>

                <Typography variant="body2" style={{ color: "crimson" }}>
                  Price: ${item.productId.price} x {item.quantity}
                </Typography>

                <Typography variant="body2" style={{ color: "#222", fontWeight: "600" }}>
                  Discount Price: <del>${item.productId.discountPrice} x {item.quantity}</del>
                </Typography>

                <Typography variant="body2" fontWeight="bold">
                  Total: ${item.productId.discountPrice * item.quantity}
                </Typography>

                <Typography>Size : {item.size}</Typography>
                <Typography>Color : {item.color}</Typography>

              </CardContent>
              <Box display="flex" alignItems="center">
                <IconButton
                  onClick={() => decrementQuantity(item._id)}
                  disabled={item.quantity <= 1}
                >
                  <RemoveIcon style={{ color: "black" }} />
                </IconButton>

                <Typography>{item.quantity}</Typography>
                <IconButton onClick={() => incrementQuantity(item._id)}>
                  <AddIcon style={{ color: "black" }} />
                </IconButton>

                <IconButton
                  onClick={() => handleDelete(item._id)}
                  sx={{ ml: "auto" }}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            </Box>
          </Card>
        ))}
        <Typography variant="h6" textAlign="center" mt={2}>
          Total Price: ${calculateTotalPrice()}
        </Typography>

        <Button
          variant="contained"
          startIcon={<ShoppingCartCheckoutIcon />}
          onClick={handleCheckout}
          sx={{ alignSelf: "center" }}
        >
          Proceed to Checkout
        </Button>
      </Stack>
    );
  };

  if (loading) {
    return (
      <Typography variant="h5" textAlign="center" mt={4}>
        <Loading />
      </Typography>
    );
  }

  return <div>{cartProductShow()}</div>;
};

export default Cart;
