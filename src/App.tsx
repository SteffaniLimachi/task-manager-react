import './App.css';
import { useEffect, useState } from "react";
import { Task } from "./types";
import { API_URL } from "./config";
import Header from "./componentes/Header";
import TaskList from "./componentes/TaskList";
import TaskInput from "./componentes/TaskInput";
import Footer from "./componentes/Footer";

function App() {

    const [tasks, setTasks] = useState<Task[]>([]);

    const fetchTasks = () => {
        fetch(`${API_URL}/tasks`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTasks(data);
            })
            .catch(error => console.error("Error al obtener tareas:", error));
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const addTask = (taskText: string) => {
        fetch(`${API_URL}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: taskText, completed: false })
        })
        .then(() => fetchTasks())
        .catch((error) => console.error("Error al crear tarea:", error));
    };

    const toggleTask = (id: number) => {
        fetch(`${API_URL}/tasks/${id}`, { method: "PUT" })
        .then(() => fetchTasks())
        .catch((error) => console.error("Error al actualizar tarea:", error));
    };

    const deleteTask = (id: number) => {
        fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" })
        .then(() => fetchTasks())
        .catch((error) => console.error("Error al eliminar tarea:", error));
    };

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;

    return (
        <div className="app-main-layout">
            <Header />
            <main>
                <TaskInput onAddTask={addTask} />
                <TaskList
                    tasks={tasks}
                    onDeleteTask={deleteTask}
                    onToggleTask={toggleTask}
                />
            </main>
            <Footer total={totalTasks} completed={completedTasks} />
        </div>
    );
}
export default App;
