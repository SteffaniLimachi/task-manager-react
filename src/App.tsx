import './App.css';
import { useEffect, useState } from "react";
import { Task } from "./types";
import Header from "./componentes/Header";
import TaskList from "./componentes/TaskList";
import TaskInput from "./componentes/TaskInput";
import Footer from "./componentes/Footer";
import Login from "./componentes/Login";

function App() {

    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [tasks, setTasks] = useState<Task[]>([]);

    const handleLogin = (newToken: string) => {
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setTasks([]);
    };

    const fetchTasks = () => {
        fetch("http://localhost:3000/tasks")
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(error => console.error("Error al obtener tareas:", error));
    };

    useEffect(() => {
        if (token) fetchTasks();
    }, [token]);

    if (!token) {
        return <Login onLogin={handleLogin} />;
    }

    const addTask = (taskText: string) => {
        const newTask: Task = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newTask)
        })
        .then(() => fetchTasks())
        .catch((error) => {
            console.error("Error al crear tarea:", error);
        });
    }

    const toggleTask = (id: number) => {
        fetch(`http://localhost:3000/tasks/${id}`, {
            method: "PUT"
        })
        .then(() => fetchTasks())
        .catch((error) => {
            console.error("Error al actualizar tarea:", error);
        });
    };

    const deleteTask = (id: number) => {
        fetch(`http://localhost:3000/tasks/${id}`, {
            method: "DELETE"
        })
        .then(() => fetchTasks())
        .catch((error) => {
            console.error("Error al eliminar tarea:", error);
        });
    };

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;

    return (
        <div className="app-main-layout">
            <Header onLogout={handleLogout} />
            <main>
                <TaskInput onAddTask={addTask} />
                <TaskList 
                    tasks={tasks} 
                    onDeleteTask={deleteTask} 
                    onToggleTask={toggleTask} 
                />
            </main>
            {/* Pasamos los contadores al Footer */}
            <Footer total={totalTasks} completed={completedTasks} />
        </div>
    );
}
export default App;