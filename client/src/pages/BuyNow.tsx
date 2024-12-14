import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../Api";
import { TextField, Button, Typography, Container, Grid } from "@mui/material";
import SucessDoneAnimation from "../pages/SucessDoneAnimation";

interface ShippingAddress {
  name: string;
  address: string;
  nearHouse: string;
  phone: string;
  pincode: string;
  email: string;
}

const BuyNow = () => {
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [pincodeError, setPincodeError] = useState<boolean>(false);
  const [orderSeccess, setOrderSeccess] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("TOKEN");

  const [shippingDetails, setShippingAddresh] = useState<ShippingAddress>({
    name: "",
    address: "",
    nearHouse: "",
    phone: "",
    pincode: "",
    email: ""
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddresh((prevData) => ({ ...prevData, [name]: value }));
    if (name === "pincode") {
      setPincodeError(false);
    }
  };

  const handleBuyNow = async () => {
    if (
      shippingDetails.name &&
      shippingDetails.address &&
      shippingDetails.nearHouse &&
      shippingDetails.phone &&
      shippingDetails.pincode &&
      shippingDetails.email
    ) {
      setBtnLoading(true);
      try {
        const res = await axios.post(
          `${api}/placeOrder`,
          { shippingDetails },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setOrderSeccess(true);
        setTimeout(() => {
          navigate("/order", { state: { order: res.data } });
          setBtnLoading(false);
        }, 3000);

        toast(`🦄 Your Order is Done!`, {
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
      } catch (error) {
        console.error(error);
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
        setBtnLoading(false);
      }
    } else {
      toast(`🦄 All fields are required!`, {
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

    setShippingAddresh({
      name: "",
      email: "",
      address: "",
      nearHouse: "",
      phone: "",
      pincode: "",
    });
  };

  return (
    <Container className="shipping_container" maxWidth="sm">
      {orderSeccess && <SucessDoneAnimation />}
      <Typography variant="h4" align="center" gutterBottom>
        <p className="shipping_text">Shipping Details</p>
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            variant="outlined"
            required
            value={shippingDetails.name}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            variant="outlined"
            required
            value={shippingDetails.email}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Full Address"
            name="address"
            variant="outlined"
            required
            value={shippingDetails.address}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Near House"
            name="nearHouse"
            variant="outlined"
            required
            value={shippingDetails.nearHouse}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            type="tel"
            variant="outlined"
            required
            value={shippingDetails.phone}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Pincode"
            name="pincode"
            type="number"
            variant="outlined"
            required
            value={shippingDetails.pincode}
            onChange={handleInputChange}
          />
          {pincodeError && (
            <Typography variant="body2" color="error">
              This pincode is not available for delivery.
            </Typography>
          )}
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBuyNow}
            disabled={btnLoading}
            fullWidth
          >
            {btnLoading ? "Processing..." : "Buy Now"}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BuyNow;
