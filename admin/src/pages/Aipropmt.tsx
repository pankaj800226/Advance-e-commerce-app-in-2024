import { useState } from "react";
import axios from "axios";
import { api } from "../Api";
import { toast } from "react-toastify";
import SideBar from "../components/SideBar";

const AdminPanel = () => {
    const [question, setQuestion] = useState('');
    const [keywords, setKeywords] = useState('');
    const [answer, setAnswers] = useState<string[]>(['']);

    const handleAddAnswerField = () => {
        setAnswers([...answer, '']);
    };

    const handleAnswerChange = (index: number, value: string) => {
        const updatedAnswers = [...answer];
        updatedAnswers[index] = value;
        setAnswers(updatedAnswers);
    };

    const handleSubmit = async () => {
        if (!question || !keywords || answer.some((answer) => !answer.trim())) {
            toast("All fields are required!");
            return;
        }

        try {
            await axios.post(`${api}/add`, {
                question,
                answer,
                // keywords: keywords.split(","),
                keywords: keywords.split(",").map(k => k.trim()),
            });
            toast("Question and Answers saved successfully!");
            setQuestion('');
            setAnswers(['']);
            setKeywords('');
        } catch (error) {
            console.error("Error saving data:", error);
            toast("An error occurred while saving.");
        }
    };

    return (
        <div className="dashboard_container">
            <SideBar />
            <main>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Add Question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="input-field"
                    />
                </div>

                <div className="form-group">
                    <textarea
                        placeholder="Add Keywords (comma separated)"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        className="input-field textarea"
                    />
                </div>

                {answer.map((answer, index) => (
                    <div key={index} className="form-group">
                        <textarea
                            // type="text"
                            placeholder={`Answer ${index + 1}`}
                            value={answer}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            className="input-field"
                        />
                    </div>
                ))}

                <button className="add-answer-btn" onClick={handleAddAnswerField}>Add Answer</button>
                <button className="save-btn" onClick={handleSubmit}>Save</button>
            </main>
        </div>
    );
};

export default AdminPanel;
