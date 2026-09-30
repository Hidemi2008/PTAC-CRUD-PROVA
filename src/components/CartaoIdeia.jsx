export default function CartaoIdeia({ ideia, onAlternar, onEditar, onExcluir }) {
  return (
    <article className={ideia.completed ? "cartao concluida" : "cartao"}>
      <h3>{ideia.title}</h3>
      <p>Status: {ideia.completed ? "Executada" : "Pendente"}</p>

      <button onClick={() => onAlternar(ideia)}>
        {ideia.completed ? "Marcar pendente" : "Marcar executada"}
      </button>
      <button onClick={() => onEditar(ideia)}>Editar</button>
      <button onClick={() => onExcluir(ideia.id)}>Excluir</button>
    </article>
  );
}