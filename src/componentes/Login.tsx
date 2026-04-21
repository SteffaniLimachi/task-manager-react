import { useState } from "react";
import "../styles/Login.css";
import { API_URL } from "../config";

interface LoginProps {
    onLogin: (token: string) => void;
}

function Login({ onLogin }: LoginProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            if (!res.ok) {
                setError("Usuario o contraseña incorrectos");
                return;
            }

            const data = await res.json();
            localStorage.setItem("token", data.token);
            onLogin(data.token);
        } catch {
            setError("Error al conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2 className="login-title">Task Manager</h2>
                <p className="login-subtitle">Inicia sesión para continuar</p>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-field">
                        <label>Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Ingresa tu usuario"
                            required
                        />
                    </div>
                    <div className="login-field">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ingresa tu contraseña"
                            required
                        />
                    </div>
                    {error && <p className="login-error">{error}</p>}
                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
