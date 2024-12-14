import axios from "axios";
import { useEffect, useState } from "react";
import { api } from "../Api";
import {
    Card,
    Typography,
    Container,
    Grid,
    CircularProgress,
    Box,
    Avatar,
    Divider,
    Button,
    Select,
    MenuItem,
    Stepper,
    Step,
    StepLabel,
} from "@mui/material";
import SideBar from "../components/SideBar";
import { toast } from "react-toastify";

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
    size: string
    color: string
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
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const steps = ["Confirmed", "Canceled", "Shipping", "Out for Delivery",];
    const token = localStorage.getItem("TOKEN");

    useEffect(() => {
        const orderFetch = async () => {
            try {
                const response = await axios.get(`${api}/allOrder`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        orderFetch();
    }, [token]);

    const handleStatusChange = async (id: string, status: string) => {
        try {
            const res = await axios.put(`${api}/orderStatus/${id}`, {
                status,
            });
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
            case "Shipping":
                return "blue";
            case "Out for Delivery":
                return "darkorange";
            default:
                return "black";
        }
    };

    const handleOrderRemove = async (id: string) => {
        try {
            await axios.delete(`${api}/orderDelete/${id}`)
            setOrders((prevOrder) => prevOrder.filter((item) => item._id !== id))
            toast.success("Order Deleted successfully!", {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

        } catch (error) {
            console.log(error);
            toast.success(`${error}`, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

        }
    }

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    const getCurrentStep = (status: string) => {
        return steps.indexOf(status);
    };






    return (
        <div className="dashboard_container">
            <SideBar />
            <main>
                <Container sx={{ marginTop: 4 }}>
                    {orders.length === 0 ? (
                        <Typography variant="h5" color="textSecondary" align="center">
                            No Orders Found
                        </Typography>
                    ) : (
                        <Grid container spacing={3}>
                            {orders.map((order) => (
                                <Grid item xs={12} key={order._id}>
                                    <Card sx={{ marginBottom: 2, padding: 2, boxShadow: 2 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Order ID: {order._id}
                                        </Typography>
                                        <Typography color="textSecondary" sx={{ marginBottom: 1 }}>
                                            Order Date:{" "}
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </Typography>

                                        <Divider sx={{ marginY: 1 }} />

                                        {order.items.map((item, idx) => (
                                            <Box
                                                key={idx}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    marginY: 1,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    <Avatar
                                                        src={`${api}/photo/${item.productId.photo[0]}`} // First photo from the product
                                                        alt={item.productId.productName}
                                                        sx={{ width: 64, height: 64, marginRight: 2 }}
                                                    />

                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight="bold">
                                                            {item.productId.productName}
                                                        </Typography>
                                                        <Typography color="textSecondary">
                                                            Quantity: {item.quantity}
                                                        </Typography>

                                                        <Typography color="textSecondary">
                                                            ₹{item.productId.price}
                                                        </Typography>

                                                        <Typography color="textSecondary">
                                                            <del>₹{item.productId.discountPrice}</del>
                                                        </Typography>


                                                        <Typography color="textSecondary">
                                                            Size :{item.size}
                                                        </Typography>

                                                        <Typography>Color : {item.color}</Typography>

                                                    </Box>
                                                </Box>


                                            </Box>
                                        ))}

                                        <Divider sx={{ marginY: 1 }} />

                                        <Typography variant="h6" color="primary">
                                            Shipping Details
                                        </Typography>
                                        <Typography>Name: {order.shippingDetails.name}</Typography>
                                        <Typography>
                                            Email: {order.shippingDetails.email}
                                        </Typography>
                                        <Typography>
                                            Address: {order.shippingDetails.address}
                                        </Typography>
                                        <Typography>
                                            Near House: {order.shippingDetails.nearHouse}
                                        </Typography>
                                        <Typography>
                                            Phone: {order.shippingDetails.phone}
                                        </Typography>
                                        <Typography>
                                            Pincode: {order.shippingDetails.pincode}
                                        </Typography>

                                        <Box sx={{ marginTop: 2 }}>
                                            <Stepper activeStep={getCurrentStep(order.status)} alternativeLabel>
                                                {steps.map((label) => (
                                                    <Step key={label}>
                                                        <StepLabel>{label}</StepLabel>
                                                    </Step>
                                                ))}
                                            </Stepper>

                                            <Select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                size="small"
                                                sx={{ marginTop: 2 }}
                                            >
                                                {steps.map((step) => (
                                                    <MenuItem key={step} value={step}>
                                                        {step}
                                                    </MenuItem>
                                                ))}
                                            </Select>

                                            {/* <h1>{calculateTotalPrice(orders?.item)}</h1> */}
                                        </Box>

                                        <Button
                                            style={{ marginTop: "10px" }}
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                        >
                                            Track Order
                                        </Button>

                                        {/* <h1>{calculateTotalPrice()}</h1> */}

                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <Box sx={{ marginTop: 2 }}>
                                                <Typography
                                                    style={{ color: getStatusColor(order.status) }}
                                                >
                                                    <span style={{ color: "black" }}>Status</span>: <span>{order.status}</span>
                                                </Typography>

                                                <button
                                                    onClick={() => handleOrderRemove(order._id)}
                                                    style={{
                                                        color: "red",
                                                        backgroundColor: "pink",
                                                        outline: "0",
                                                        border: "0",
                                                        padding: "10px",
                                                        cursor: "pointer",
                                                        borderRadius: "3px",


                                                    }}>
                                                    Delete

                                                </button>
                                            </Box>
                                        </div>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>
            </main>
        </div>
    );
};

export default Order;
