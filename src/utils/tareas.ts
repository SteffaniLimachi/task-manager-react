import { Task } from "../types";

export function contarTareasPendientes(tareas: Task[]): number {
    return tareas.filter((t) => !t.completed).length;
}

export function esTituloValido(titulo: string): boolean {
    return titulo.trim().length > 0;
}
