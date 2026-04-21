import "../styles/Header.css";

interface HeaderProps {
    onLogout?: () => void;
}

function Header({ onLogout }: HeaderProps) {
    return (
        <header>
            <h1>Task Manager Steffani</h1>
            {onLogout && (
                <button className="btn-logout" onClick={onLogout}>
                    Cerrar sesión
                </button>
            )}
        </header>
    );
}

export default Header;