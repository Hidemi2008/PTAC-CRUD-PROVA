import CartaoIdeia from "./CartaoIdeia";

export default function ListaIdeias({ ideias, onAlternar, onEditar, onExcluir }) {
    return (
        <div className="lista">
            {ideias.map((i) => (
                <CartaoIdeia
                    key={i.id}
                    ideia={i}
                    onAlternar={onAlternar}
                    onEditar={onEditar}
                    onExcluir={onExcluir}
                />
            ))}
        </div>
    );
}