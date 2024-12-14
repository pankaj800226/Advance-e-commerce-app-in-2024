import axios from "axios";
import { useEffect, useState } from "react";
import { api } from "../Api";
import { useParams } from "react-router-dom";
import { Card, CardContent, Avatar, Typography, Rating, IconButton, } from '@mui/material';
import { toast } from "react-toastify";
import DeleteIcon from '@mui/icons-material/Delete'


// Define the Feedback type based on the expected structure from your API
interface Rating {
    _id: string;
    userId: {
        _id: string;
        username: string;
        profileImg: string;
    };
    rating: number;
    comment: string;
}

const RatingSystem = () => {
    const [rating, setRating] = useState<Rating[]>([]);
    const token = localStorage.getItem('TOKEN')
    const isAlreadyloginUser = localStorage.getItem('USER_ID')
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchingRating = async () => {
            try {
                const response = await axios.get<Rating[]>(`${api}/ratingGet/${id}`);
                setRating(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchingRating();
    }, [id, rating]);

    const ratingDeleteHandler = async (productId: string) => {
        try {
            await axios.delete(`${api}/rating/delete/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }

            })
            setRating((prev) => prev.filter((item) => item._id !== productId))
            toast("Delete Done", {
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
            toast.error(`error: ${error}`);
        }
    }


    return (
        <div className="rating_container">
            {
                rating.length === 0 ? (
                    <h4>Rating Is Empty</h4>
                ) : (
                    rating.map((ratings, index) => (
                        <Card key={index} variant="outlined" sx={{ display: 'flex', alignItems: 'center', margin: 2 }}>
                            <Avatar alt={ratings.userId.username} src={`${api}/profileImg/${ratings?.userId.profileImg}`} sx={{ width: 56, height: 56, margin: 2, cursor: "pointer" }} />
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {ratings.userId.username}
                                </Typography>
                                <Rating value={ratings.rating} readOnly />
                                <Typography variant="body2" color="text.secondary">
                                    {ratings.comment}
                                </Typography>
                            </CardContent>
                            {
                                ratings.userId._id === isAlreadyloginUser && (
                                    <IconButton
                                        className="delete_icon"

                                        onClick={() => ratingDeleteHandler(ratings._id)}>
                                        <DeleteIcon style={{ color: "crimson" }} />
                                    </IconButton>

                                )
                            }
                        </Card>
                    ))
                )
            }
        </div>
    );
}

export default RatingSystem;
