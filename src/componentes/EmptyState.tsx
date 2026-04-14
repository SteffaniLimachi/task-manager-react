import "../styles/EmptyState.css";
function EmptyState() {
  return (
    <div style={{ textAlign: 'center', marginTop: '20px', color: 'gray' }}>
      <p>No tienes tareas pendientes.</p>
    </div>
  );
}

export default EmptyState;