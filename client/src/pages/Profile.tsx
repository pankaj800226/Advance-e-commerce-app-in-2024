import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../Api";
import { Button, Typography, Box, Avatar } from "@mui/material";
import { motion } from 'framer-motion';
import Loading from "../components/Loading";

interface Profile {
  username: string;
  profileImg: string;
  email: string;
  phoneNumber?: string; // Optional for additional details
  address?: string; // Optional for additional details
}

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('TOKEN');
  const navigate = useNavigate();

  const email = localStorage.getItem('EMAIL');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigate('/login'); // Redirect to login if no token is found
        return;
      }

      try {
        const response = await axios.post(`${api}/profile`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.log("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  if (loading) {
    return <Loading />; // Or a loading spinner component
  }

  const logOut = () => {
    localStorage.clear();
    navigate('/login')
  }

  return (
    <motion.div
      className="profile_container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
      }}
    >
      {profile ? (
        <>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
          >
            <Avatar
              src={`${api}/profileImg/${profile.profileImg}`}
              alt={`${profile.username}'s profile`}
              sx={{ width: 150, height: 150, marginBottom: 2 }}
            />
            <Typography variant="h5" fontWeight="bold">
              {profile.username}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {profile.email}
            </Typography>

          </Box>

          <Box mt={4} display="flex" flexDirection="column" gap={2}>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/order"
              fullWidth
            >
              View Orders
            </Button>

            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/favorite"
              fullWidth
            >
              My Wishlist
            </Button>

            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/feedback"
              fullWidth
            >
              Add Feedback
            </Button>

            {email ? (
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={logOut}
              >
                Logout
              </Button>
            ) : (
              <Typography variant="body1" color="error" textAlign="center">
                Email not available.
              </Typography>
            )}
          </Box>
        </>
      ) : (
        <h2>Profile not found</h2>
      )}
    </motion.div>
  );
};

export default Profile;
