export default function FormularioIdeia({ titulo, setTitulo, editando, enviando, onSubmit, onCancelar, }) {
    return (
        <form onSubmit={onSubmit}>
            <h2>{editando ? "Editar ideia" : "Nova ideia"}</h2>
            <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="App de receitas da vovó"
            />
            <button type="submit" disabled={enviando}>
                {editando ? "Salvar alterações" : "Adicionar ideia"}
            </button>
            {editando && (
                <button type="button" onClick={onCancelar} disabled={enviando}>
                    Cancelar
                </button>
            )}
        </form>
    );
}