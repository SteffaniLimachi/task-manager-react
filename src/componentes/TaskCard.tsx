import "../styles/TaskCard.css";
import { Task } from "../types";

interface TaskCardProps {
    task: Task;
    onDelete: (id: number) => void;
    onToggle: (id: number) => void;
}

function TaskCard({ task, onDelete, onToggle }: TaskCardProps) {
    return (
        <li className="task-item">
            <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => onToggle(task.id)} 
            />
            <span 
                style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                className="task-text"
            >
                {task.text}
            </span>
            <button className="btn-delete" onClick={() => onDelete(task.id)}>
                Eliminar
            </button>
        </li>
    );
}

export default TaskCard;