import { motion } from 'framer-motion';
import React from 'react';
interface SuggestionProps {
    suggestedOutfit: string;
    questionType: string
}

const Suggestion: React.FC<SuggestionProps> = ({ suggestedOutfit, questionType }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="suggestion-box">
            <p><strong>Question Type:</strong> {questionType}</p>
            <p><strong>Outfit:</strong> {suggestedOutfit}</p>
        </motion.div>
    );
};

export default Suggestion;
