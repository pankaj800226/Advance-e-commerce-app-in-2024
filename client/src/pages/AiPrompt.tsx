import { useRef, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"; // Optional styling
import axios from "axios";
import { api } from "../Api";
import { toast } from "react-toastify";

const PromptForm = () => {

    const [messages, setMessages] = useState<
        { question: string; answer: string; isCode: boolean }[]
    >([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const username = localStorage.getItem("USERNAME") || "Guest";
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim())
            return toast("Add Any Question", {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

        const userMessage = input;
        setInput("");
        setMessages((prev) => [
            ...prev,
            { question: userMessage, answer: "Typing...", isCode: false },
        ]);

        try {
            setLoading(true);

            // Replace with your backend endpoint
            const response = await axios.post(`${api}/getResponse`, { question: userMessage });

            const responseText = response.data.response || "No response";
            const isCode = responseText.includes("```");

            setMessages((prev) =>
                prev.map((msg, index) =>
                    index === prev.length - 1
                        ? {
                            ...msg,
                            // Remove code block markers
                            answer: responseText.replace(/```/g, ""),
                            isCode,
                        }
                        : msg
                )
            );
        } catch (error) {
            console.error("Error fetching AI response:", error);
            setMessages((prev) =>
                prev.map((msg, index) =>
                    index === prev.length - 1
                        ? { ...msg, answer: "An error occurred. Please try again.", isCode: false }
                        : msg
                )
            );
        } finally {
            setLoading(false);
            chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
        }
    };

    const handleCodeCopy = (text: string) => {
        try {
            navigator.clipboard.writeText(text);
            toast("copied", {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })

        } catch (error) {
            console.log(error);
            toast.error(`${error} : Error`, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })

        }

    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="chat-container"
        >
            {/* Header */}
            <div className="top_header">
                <h2>Nexa AI</h2>
                <h2>
                    <span style={{ color: "blueviolet" }}>Hello</span> <span style={{ color: "white" }}>{username}</span>
                </h2>
            </div>

            {/* Chat Display */}
            <div
                className="suggestion-container"
                ref={chatContainerRef}
                style={{ maxHeight: "400px", overflowY: "auto" }}
            >
                <AnimatePresence>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="data"
                        >
                            <div className="data_header">
                                <p className="qst" style={{ fontWeight: "bold" }}>
                                    Q: {msg.question} :
                                </p>
                                <p
                                    onClick={() => handleCodeCopy(msg.answer)}
                                    style={{ color: "white", cursor: "pointer" }}>Code Copy</p>
                            </div>
                            <div className="answers-container">
                                {msg.isCode ? (
                                    <SyntaxHighlighter
                                        language="javascript"
                                        style={atomDark}
                                    >
                                        {msg.answer}
                                    </SyntaxHighlighter>
                                ) : (
                                    <p>{msg.answer}</p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Prompt Query */}
            <form className="prompt-form" onSubmit={handleSubmit}>
                <div className="input-container">
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Message ChatAI"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                    />
                    <button type="submit" disabled={loading}>
                        <AiOutlineSend />
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default PromptForm;

