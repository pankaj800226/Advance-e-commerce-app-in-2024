import { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../components/SideBar";
import { toast } from "react-toastify";
import { api } from "../Api";

// Feedback interface
interface Feed {
    feedbackComment: string;
    _id: string;
    userId?: {
        username: string;
    };
}

const Feedback = () => {
    const [feedbackList, setFeedbackList] = useState<Feed[]>([]);

    // Fetch feedback on component mount
    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axios.get<Feed[]>(`${api}/feedbackGet`);
                setFeedbackList(response.data);
            } catch (error) {
                console.error(error);
                toast.error("Error fetching feedback");
            }
        };

        fetchFeedback();
    }, []);

    // Delete feedback by ID
    const deleteFeedback = async (id: string) => {
        try {
            await axios.delete(`${api}/feedbackDelete/${id}`);
            toast.success("Feedback deleted successfully");
            setFeedbackList((prev) => prev.filter((data) => data._id !== id));
        } catch (error) {
            console.error(error);
            toast.error("Error deleting feedback");
        }
    };

    return (
        <div className="dashboard_container">
            <SideBar />
            <main>
                <h1>User Feedback</h1>
                {feedbackList.length > 0 ? (
                    <ul className="feedback_list">
                        {feedbackList.map((feedback) => (
                            <li key={feedback._id} className="feedback_item">
                                <p>{feedback.feedbackComment}</p>
                                <span>By: {feedback.userId?.username || "Anonymous"}</span>
                                <button
                                    className="delete_button"
                                    onClick={() => deleteFeedback(feedback._id)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No feedback available</p>
                )}
            </main>
        </div>
    );
};

export default Feedback;
