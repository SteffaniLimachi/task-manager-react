import "../styles/TaskList.css";
import EmptyState from "./EmptyState";
import TaskCard from "./TaskCard";
import { Task } from "../types";

interface TaskListProps {
    tasks: Task[];
    onDeleteTask: (id: number) => void;
    onToggleTask: (id: number) => void;
}

function TaskList({ tasks, onDeleteTask, onToggleTask }: TaskListProps) {
    if (tasks.length === 0) {
        return <EmptyState />;
    }

    return (
        <ul>
            {tasks.map((task) => (
                <TaskCard 
                    key={task.id} 
                    task={task}
                    onDelete={onDeleteTask} 
                    onToggle={onToggleTask}
                />
            ))}
        </ul>
    );
}

export default TaskList;