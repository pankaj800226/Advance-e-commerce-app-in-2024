import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate } from "react-router-dom";
import { FaCartPlus } from "react-icons/fa";
const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const email = localStorage.getItem("EMAIL");

  const logOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="header">
      <Link to={"/"}>
        {/* <img
          src="logo.jpg"
          alt=""
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
          }}
        /> */}
        NexaStore
      </Link>

      {/* <SearchBar /> */}
      <nav>
        <div>
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <p>{email?.charAt(0)}</p>
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
            <MenuItem onClick={logOut}>LogOut</MenuItem>
          </Menu>
        </div>
      </nav>
    </div>
  );
};

export default Header;
