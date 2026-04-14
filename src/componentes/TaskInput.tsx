import { useState } from "react";
import "../styles/TaskInput.css";

interface TaskInputProps {
    onAddTask: (text: string) => void;
}

function TaskInput({ onAddTask }: TaskInputProps) {
    const [inputText, setInputText] = useState("");

    const handleAdd = () => {
        if (inputText.trim()) {
            onAddTask(inputText);
            setInputText(""); // Limpiar el input
        }
    };

    return (
        <div className="task-input-container">
            <input 
                type="text" 
                value={inputText} 
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe una tarea..."
            />
            <button className="btn-add" onClick={handleAdd}>Agregar</button>
        </div>
    );
}

export default TaskInput;