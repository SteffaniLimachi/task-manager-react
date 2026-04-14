import "../styles/Footer.css";

interface FooterProps {
    total: number;
    completed: number;
}

function Footer({ total, completed }: FooterProps) {
    const year = new Date().getFullYear();

    return (
        <footer className="footer-container">
            <div className="stats-summary">
                {`${completed} de ${total} tareas completadas`}
            </div>
            <p>© {year} - Task Manager Steffani</p>
        </footer>
    );
}

export default Footer;