import { useState, useEffect } from "react";
import FormularioIdeia from "./components/FormularioIdeia";
import ListaIdeias from "./components/ListaIdeias";

import "./App.css";

const URL_BASE = "https://jsonplaceholder.typicode.com/todos";
const URL_LISTA = `${URL_BASE}?_limit=15`;

export default function App() {
  const [ideias, setIdeias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarga, setErroCarga] = useState(null);
  const [erroAcao, setErroAcao] = useState(null);

  const [titulo, setTitulo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [criado, setCriado] = useState(null);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    const controle = new AbortController();
    const signal = controle.signal;

    async function buscar() {
      try {
        setCarregando(true);
        setErroCarga(null);
        const resp = await fetch(URL_LISTA, { signal });
        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status} — ${resp.statusText}`);
        }
        const data = await resp.json();
        setIdeias(data);
      } catch (e) {
        if (e.name !== "AbortError") {
          setErroCarga(e.message);
        }
      } finally {
        setCarregando(false);
      }
    }

    buscar();

    return () => controle.abort();
  }, []);

  async function enviar(e) {
    e.preventDefault();
    if (!titulo.trim()) return;
    setEnviando(true);
    setErroAcao(null);
    setCriado(null);

    try {
      if (editandoId !== null) {
        const ideiaAtual = ideias.find((i) => i.id === editandoId);
        const dadosAtualizados = { ...ideiaAtual, title: titulo };

        await atualizarIdeia(editandoId, dadosAtualizados);

        setIdeias((atuais) =>
          atuais.map((i) => (i.id === editandoId ? dadosAtualizados : i))
        );

        setEditandoId(null);
        setTitulo("");
      } else {
        const novaIdeia = {
          title: titulo,
          completed: false,
          userId: 1,
        };

        const resp = await fetch(URL_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(novaIdeia),
        });

        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();

        const nova = { ...data, id: Date.now() };

        setIdeias((atuais) => [nova, ...atuais]);
        setCriado(nova);
        setTitulo("");
      }
    } catch (e) {
      setErroAcao(e.message);
    } finally {
      setEnviando(false);
    }
  }

  async function atualizarIdeia(id, novosDados) {
    const resp = await fetch(`${URL_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novosDados),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  }

  function iniciarEdicao(ideia) {
    setTitulo(ideia.title);
    setEditandoId(ideia.id);
    setCriado(null);
    setErroAcao(null);
  }

  function cancelarEdicao() {
    setTitulo("");
    setEditandoId(null);
    setCriado(null);
    setErroAcao(null);
  }

  async function excluirIdeia(id) {
    const backup = ideias;
    setErroAcao(null);
    setIdeias((atuais) => atuais.filter((i) => i.id !== id));

    try {
      const resp = await fetch(`${URL_BASE}/${id}`, { method: "DELETE" });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    } catch (e) {
      setIdeias(backup);
      setErroAcao(e.message);
    }
  }

  async function alternarStatus(ideia) {
    setErroAcao(null);
    const novoStatus = !ideia.completed;

    try {
      await atualizarIdeia(ideia.id, { ...ideia, completed: novoStatus });

      setIdeias((atuais) =>
        atuais.map((i) =>
          i.id === ideia.id ? { ...i, completed: novoStatus } : i
        )
      );
    } catch (e) {
      setErroAcao(e.message);
    }
  }

  return (
    <>
      <header>
        <h1>Banco de Ideias</h1>
        <p>Projeto P1 - PTAC4 · anotação de ideias de projetos</p>
      </header>

      <main className="layout">
        <aside>
          <FormularioIdeia
            titulo={titulo}
            setTitulo={setTitulo}
            editando={editandoId !== null}
            enviando={enviando}
            onSubmit={enviar}
            onCancelar={cancelarEdicao}
          />
          {enviando && <p>Enviando...</p>}
          {erroAcao && <p>Erro: {erroAcao}</p>}
          {criado && <p>Criada com id={criado.id} e título={criado.title}.</p>}
        </aside>

        <section>
          <h2>Minhas ideias</h2>

          {carregando && <p>Carregando ideias...</p>}

          {erroCarga && (
            <p>Não foi possível conectar à API. Tente novamente mais tarde.</p>
          )}

          {!carregando && !erroCarga && ideias.length === 0 && (
            <p>Nenhuma ideia por aqui — que tal cadastrar a primeira?</p>
          )}

          {!carregando && !erroCarga && ideias.length > 0 && (
            <ListaIdeias
              ideias={ideias}
              onAlternar={alternarStatus}
              onEditar={iniciarEdicao}
              onExcluir={excluirIdeia}
            />
          )}
        </section>
      </main>
    </>
  );
}