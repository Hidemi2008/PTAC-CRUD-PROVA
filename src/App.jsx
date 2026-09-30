import { useState, useEffect } from "react";

const URL_BASE = "https://jsonplaceholder.typicode.com/todos"
const URL_LISTA = `${URL_BASE}?_limit=15`

export default function App() {
  const [ideias, setIdeias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroCarga, setErroCarga] = useState(null)
  const [erroAcao, setErroAcao] = useState(null)

  const [titulo, setTitulo] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [criado, setCriado] = useState(null)
  const [editandoId, setEditandoId] = useState(null)

  useEffect(() => {
    const controle = new AbortController()
    const signal = controle.signal


    async function buscar() {
      try {
        setCarregando(true)
        setErroCarga(null)
        const resp = await fetch(URL_BASE, { signal })
        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status} — ${resp.statusText}`)
        }
        const data = await resp.json()
        setIdeias(data)
      } catch (e) {
        if (e.name !== 'AbortError') {
          setErroCarga(e.message)
        }
      } finally {
        setCarregando(false)
      }
    }

    buscar()

    return () => controle.abort()
  }, [])

  async function enviar(e) {
    e.preventDefault()
    setEnviando(true)
    setErroAcao(null)
    setCriado(null)
    try {
      if (editandoId !== null) {
        const ideiaAtual = ideias.find((ideia) => ideia.id === editandoId)
        const dadosAtualizados = { ...ideiaAtual, title: titulo }
        const data = await atualizarIdeia(editandoId, dadosAtualizados)

        setIdeias((ideiasAtuais) =>
          ideiasAtuais.map((ideia) =>
            ideia.id === editandoId ? { ...ideia, ...data, title: titulo } : ideia
          )
        )
        setTitulo("")
        setEditandoId(null)
        return
      }

      const resp = await fetch(URL_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          title: titulo,
          completed: false
        })
      })
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const data = await resp.json()
      setIdeias((ideiasAtuais) => [...ideiasAtuais, data])
      setCriado(data)
      setTitulo("")
    } catch (e) {
      setErroAcao(e.message)
    } finally {
      setEnviando(false)
    }
  }

  async function atualizarIdeia(id, novosDados) {
    const resp = await fetch(`${URL_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novosDados),
    })
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    return await resp.json()
  }

  function iniciarEdicao(ideia) {
    setTitulo(ideia.title)
    setEditandoId(ideia.id)
    setCriado(null)
    setErroAcao(null)
  }

  function cancelarEdicao() {
    setTitulo("")
    setEditandoId(null)
    setCriado(null)
    setErroAcao(null)
  }

  async function excluirIdeia(id) {
    const backup = ideias
    setErroAcao(null)
    setIdeias((atuais) => atuais.filter((i) => i.id !== id))
    try {
      const resp = await fetch(`${URL_BASE}/${id}`, { method: '___' })
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    } catch (e) {
      setIdeias(backup)
      setErroAcao(e.message)
    }
  }

  async function alternarStatus(ideia) {
    setErroAcao(null)
    const novoStatus = ___

    try {
      await atualizarIdeia(ideia.id, { ...ideia, completed: novoStatus })

      setIdeias((atuais) =>
        atuais.map((i) =>
          i.id === ideia.id ? { ...i, completed: novoStatus } : i
        )
      )
    } catch (e) {
      setErroAcao(e.message)
    }
  }


  return (
    <>
      <header>
        <h1>Banco de Ideias</h1>
        <p>Projeto P1 - PTAC4 . anotacao de ideias de projetos</p>
      </header>

      <div>
        <form onSubmit={enviar}>
          <h2>{editandoId !== null ? "Editar ideia" : "Nova ideia"}</h2>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="App de receitas da vovó"
          />
          <button disabled={enviando}>
            {editandoId !== null ? "Salvar alterações" : "Adicionar ideia"}
          </button>
          {editandoId !== null && (
            <button type="button" onClick={cancelarEdicao} disabled={enviando}>
              Cancelar
            </button>
          )}
          {enviando && <p>Enviando...</p>}
          {erroAcao && <p>Erro: {erroAcao}</p>}
          {criado && <p> Criado com id={criado.userId} e titulo={criado.title}.</p>}
        </form>
      </div>

      <section>
        <h2>Minhas ideias</h2>

        {carregando && <p>Carregando ideias...</p>}

        {erroCarga && <p>Não foi possível conectar à API. Tente novamente mais tarde.</p>}

        {!carregando && !erroCarga && ideias.length === 0 && (
          <p>Nenhuma ideia por aqui — que tal cadastrar a primeira?</p>
        )}

        {!carregando && !erroCarga && ideias.length > 0 && (
          <div>
            {ideias.map((i) => (
              <article
                key={i.userId}
                className={i.completed ? "cartao concluida" : "cartao"}
              >
                <h3>{i.title}</h3>
                <p>Status: {___ ? "Executada" : "Pendente"}</p>

                <button onClick={() => alternarStatus(i)}>
                  {i.completed ? "Marcar pendente" : "Marcar executada"}
                </button>
                <button onClick={() => iniciarEdicao(i)}>Editar</button>
                <button onClick={() => excluirIdeia(i.id)}>Excluir</button>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );

}
