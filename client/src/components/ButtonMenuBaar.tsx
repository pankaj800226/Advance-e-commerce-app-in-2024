import React from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { CgMoreO } from "react-icons/cg";

import { Link } from "react-router-dom";

const ButtonMenuBaar: React.FC = () => {
    const [value, setValue] = React.useState(0);

    return (
        <div
            className="buttom_menu_container"
            style={{
                position: "fixed",
                bottom: 0,
                width: "100%",
                zIndex: 1000,
            }}
        >
            <BottomNavigation
                value={value}
                onChange={(_, newValue) => {
                    setValue(newValue);
                }}
                sx={{
                    backgroundColor: "#f8f9fa",
                    boxShadow: "0px -2px 15px rgba(0,0,0,0.2)",
                    transition: "background-color 0.3s ease-in-out",
                    "&:hover": {
                        backgroundColor: "#eaeaea",
                    },
                }}
            >
                <BottomNavigationAction
                    label="Home"
                    icon={<HomeIcon />}
                    component={Link}
                    to="/"
                    sx={{
                        "& .MuiSvgIcon-root": {
                            transition: "transform 0.3s ease-in-out",
                        },
                        "&:hover .MuiSvgIcon-root": {
                            transform: "scale(1.2)",
                        },
                        "&:hover": {
                            color: "#1976d2",
                        },
                    }}
                />

                <BottomNavigationAction
                    label="More"
                    icon={<CgMoreO size={24} />}
                    component={Link}
                    to="/more"
                    sx={{
                        "& svg": {
                            transition: "transform 0.3s ease-in-out",
                        },
                        "&:hover svg": {
                            transform: "rotate(360deg)",
                        },
                        "&:hover": {
                            color: "#6a1b9a",
                        },
                    }}
                />

                <BottomNavigationAction
                    label="Cart"
                    icon={<ShoppingCartIcon />}
                    component={Link}
                    to="/cart"
                    sx={{
                        "& .MuiSvgIcon-root": {
                            transition: "transform 0.3s ease-in-out",
                        },
                        "&:hover .MuiSvgIcon-root": {
                            transform: "scale(1.2)",
                        },
                        "&:hover": {
                            color: "#f57c00",
                        },
                    }}
                />

                <BottomNavigationAction
                    label="Account"
                    icon={<AccountCircleIcon />}
                    component={Link}
                    to="/profile"
                    sx={{
                        "& .MuiSvgIcon-root": {
                            transition: "transform 0.3s ease-in-out",
                        },
                        "&:hover .MuiSvgIcon-root": {
                            transform: "scale(1.2)",
                        },
                        "&:hover": {
                            color: "#2e7d32",
                        },
                    }}
                />
            </BottomNavigation>
        </div>
    );
};

export default ButtonMenuBaar;
