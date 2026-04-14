import './App.css';
import { useState } from "react";
import { Task } from "./types";
import Header from "./componentes/Header";
import TaskList from "./componentes/TaskList";
import TaskInput from "./componentes/TaskInput";
import Footer from "./componentes/Footer";

function App() {
    const [tasks, setTasks] = useState<Task[]>([]);

    const addTask = (text: string) => {
        const newTask: Task = {
            id: Date.now(), // Usamos la fecha como ID único
            text: text,
            completed: false, // para saber el estado de la tarea
        };
        setTasks([...tasks, newTask]);
    };

    // Función para marcar/desmarcar
    const toggleTask = (id: number) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const deleteTask = (id: number) => {
        setTasks(tasks.filter(task => task.id !== id));
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
            {/* Pasamos los contadores al Footer */}
            <Footer total={totalTasks} completed={completedTasks} />
        </div>
    );
}
export default App;