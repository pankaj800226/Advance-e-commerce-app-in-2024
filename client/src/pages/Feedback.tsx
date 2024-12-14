import { Button, Container, Grid, TextField, Typography } from "@mui/material"
import axios from "axios"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { api } from "../Api"

const Feedback = () => {
  const [feedbackComment, setFeedbackComment] = useState('')
  const token = localStorage.getItem('TOKEN')

  const handleSubmit = async () => {
    if (feedbackComment !== "") {
      try {
        await axios.post(`${api}/feedback`, { feedbackComment }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        toast(`Thank You For Feedback.`, {
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

        // setFeedbackComment(response.data)

      } catch (error) {
        console.log(error);
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

      }
    } else {
      toast(`Pahale Kuch To Likho Yaar.`, {
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

    setFeedbackComment('')
  }
  return (
    <Container className="shipping_container" maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        <p>Your Feedback</p>
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Comment"
            name="name"
            variant="outlined"
            required
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Feedback