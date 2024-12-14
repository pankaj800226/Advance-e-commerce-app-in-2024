import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate } from "react-router-dom";
import { FaCartPlus,FaSearchDollar } from "react-icons/fa";
import axios from "axios";
import { api } from "../Api";
interface CartItem {
  productId: string;
  quantity: number;
}

interface CartResponse {
  items: CartItem[];
}

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const [carts, setCarts] = React.useState<CartItem[]>([]); // Use typed state for carts
  const token = localStorage.getItem("TOKEN");
  const email = localStorage.getItem("EMAIL");

  React.useEffect(() => {
    const fetchCartProduct = async () => {
      try {
        const response = await axios.post<CartResponse>(`${api}/getCart`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCarts(response.data.items); // Set the cart items
      } catch (error) {
        console.error("Error fetching cart products:", error);
        setCarts([]);
      }
    };

    fetchCartProduct();
  }, [token, carts]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="header">
      <Link
        to={"/"}
        style={{
          textDecoration: "none",
          color: "black",
          fontSize: "1.4rem",
          marginLeft: "10px",
        }}
      >

        <h3>RS</h3>
      </Link>

      <nav>
        <Link to={'/search'}>
          <MenuItem>
          <FaSearchDollar/>
          </MenuItem>
        </Link>
        {/* <p className="user_Logo">{email?.charAt(0).toUpperCase()}</p> */}

        <MenuItem>
          <Link className="more" to={"/more"} style={{ textDecoration: "none", color: "black" }}>
            MORE
          </Link>
        </MenuItem>

        <MenuItem>
          <Link className="cart" to={"/cart"} style={{ textDecoration: "none", color: "black" }}>
            <FaCartPlus />
            <sub>{carts?.length}</sub>
          </Link>
        </MenuItem>

        <div className="menu_item">
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <p>{email?.charAt(0).toUpperCase()}</p>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <Link
              to={"/profile"}
              style={{ textDecoration: "none", color: "black" }}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
            </Link>

            <Link
              to={"/order"}
              style={{ textDecoration: "none", color: "black" }}
            >
              <MenuItem onClick={handleClose}>Order</MenuItem>
            </Link>

            <Link
              to={"/Aiprompt"}
              style={{ textDecoration: "none", color: "black" }}
            >
              <MenuItem onClick={handleClose}>CHAT AI</MenuItem>
            </Link>

            <Link
              to={"/feedback"}
              style={{ textDecoration: "none", color: "black" }}
            >
              <MenuItem onClick={handleClose}>Feedback</MenuItem>
            </Link>


            <MenuItem onClick={logOut}>LogOut</MenuItem>
          </Menu>
        </div>
      </nav>
    </div>
  );
};

export default Header;
