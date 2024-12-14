import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Card,
  Divider,
  Avatar,
  IconButton,
  Button,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../Api";
import shipping from '../assets/shopping.png';

interface Product {
  _id: string;
  productName: string;
  photo: string[];
  price: number;
  discountPrice: number;
}

interface ProductItem {
  productId: Product;
  quantity: number;
  size: number;
  color: string;

}

interface ShippingDetails {
  name: string;
  email: string;
  address: string;
  phone: string;
  pincode: string;
  nearHouse: string;
}

interface OrderItem {
  _id: string;
  items: ProductItem[];
  shippingDetails: ShippingDetails;
  orderStatus: string;
  createdAt: string;
  status: string;
}

const Order = () => {
  const steps = ["Confirmed", "Canceled", "Shipping", "Out for Delivery"];
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [trackDialogOpen, setTrackDialogOpen] = useState(false);
  const [trackOrderId, setTrackOrderId] = useState<string>("");
  const [trackResult, setTrackResult] = useState<string | null>(null);


  const navigate = useNavigate();
  const token = localStorage.getItem("TOKEN");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${api}/orderGet`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await axios.put(`${api}/orderStatus/${id}`, { status });
      setOrders((prevData) =>
        prevData.map((order) =>
          order._id === id ? { ...order, status: res.data.status } : order
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Canceled":
        return "red";
      case "Confirmed":
        return "green";
      case "Out for Delivery":
        return "darkorange";
      default:
        return "gray";
    }
  };

  const handleGotoHome = () => {
    navigate("/");
  };

  const calculateTotalPrice = (items: ProductItem[]) => {
    return items.reduce((acc, item) => acc + item.productId.discountPrice * item.quantity, 0);
  };

  const getCurrentStep = (status: string) => steps.indexOf(status);

  const handleCopyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast(`Order ID copied: ${id}`);
  };

  const handleTrackOrder = () => {
    const order = orders.find((o) => o._id === trackOrderId);
    setTrackResult(order ? `Order Status: ${order.status}` : "Order not found");
  };

  const openTrackDialog = () => {
    setTrackDialogOpen(true);
    setTrackResult('')
  }

  const closeTrackDialog = () => {
    setTrackDialogOpen(false);
    setTrackOrderId("");
  };



  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      {orders.length === 0 ? (
        <div className="empty_cart">
          <Typography>No Orders Found</Typography>
          <img src={shipping} alt="No orders" />
          <button onClick={handleGotoHome}>Go to Home</button>
        </div>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Card sx={{ marginBottom: 2, padding: 2, boxShadow: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Order ID: {order._id}
                  <IconButton onClick={() => handleCopyOrderId(order._id)}>
                    <ContentCopyIcon />
                  </IconButton>
                </Typography>
                <Typography color="textSecondary" sx={{ marginBottom: 1 }}>
                  Order Date: {new Date(order.createdAt).toLocaleDateString()}
                </Typography>

                <Divider sx={{ marginY: 1 }} />

                {order.items.map((item, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center", marginY: 1 }}>
                    <Avatar
                      src={`${api}/photo/${item?.productId?.photo[0]}`}
                      alt={item.productId.productName}
                      sx={{ width: 64, height: 64, marginRight: 2 }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.productId.productName}
                      </Typography>
                      <Typography color="textSecondary">Quantity: {item.quantity}</Typography>
                      <Typography color="textSecondary">Price: ₹{item.productId.price}</Typography>
                      <Typography color="textSecondary">DiscountPrice: ₹<del>{item.productId.discountPrice}</del></Typography>
                      <Typography>Size : {item.size}</Typography>
                      <Typography>Color : {item.color}</Typography>
                    </Box>
                  </Box>
                ))}

                <Divider sx={{ marginY: 1 }} />
                <Typography variant="h6" color="primary">Shipping Details</Typography>
                <Typography>Name: {order.shippingDetails.name}</Typography>
                <Typography>Email: {order.shippingDetails.email}</Typography>
                <Typography>Address: {order.shippingDetails.address}</Typography>
                <Typography>Pincode: {order.shippingDetails.pincode}</Typography>
                <Typography>NearHouse: {order.shippingDetails.nearHouse}</Typography>


                <Typography variant="h5" mt={2}>
                  Total Price: ₹{calculateTotalPrice(order.items)}
                </Typography>

                <Stepper activeStep={getCurrentStep(order.status)} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel style={{ color: getStatusColor(order.status) }}>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>


                <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)}>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Canceled">Canceled</option>
                </select>


                <Button onClick={openTrackDialog} variant="contained" color="primary" size="small">
                  Track Order
                </Button>
              </Card>


            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={trackDialogOpen} onClose={closeTrackDialog}>
        <DialogTitle>Track Order</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter your Order ID to track your order's status.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Order ID"
            fullWidth
            variant="outlined"
            value={trackOrderId}
            onChange={(e) => setTrackOrderId(e.target.value)}
          />

          {trackResult && <Typography>{trackResult}</Typography>}

        </DialogContent>
        <DialogActions>
          <Button onClick={closeTrackDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleTrackOrder} color="primary">
            Track
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Order;
