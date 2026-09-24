import { useState, useEffect } from "react";

const URL = "https://jsonplaceholder.typicode.com/todos?_limit=15"

export default function App() {
  const [ideias, setIdeias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const [titulo, setTitulo] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [criado, setCriado] = useState(null)

  useEffect(() => {
    const controle = new AbortController()
    const signal = controle.signal


    async function buscar() {
      try {
        setCarregando(true)
        setErro(null)
        const resp = await fetch(URL, { signal })
        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status} — ${resp.statusText}`)
        }
        const data = await resp.json()
        setIdeias(data)
        console.log(ideias)
      } catch (e) {
        if (e.name !== 'AbortError') {
          setErro(e.message)
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
    setErro(null)
    setCriado(null)
    try {
      const resp = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1, titulo: titulo, completed: false }),
      })
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const data = await resp.json()
      setCriado(data)
      setTitulo("")
    } catch (e) {
      setErro(e.message)
    } finally {
      setEnviando(false)
    }
  }

  async function atualizarUsuario(id, novosDados) {
    const resp = await fetch(`${URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novosDados),
    })
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    return await resp.json()
  }

  async function excluirUsuario(id) {
    const resp = await fetch(`${URL}/${id}`, {
      method: 'DELETE',
    })
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    return true
  }

  if (carregando) return <p>Carregando...</p>
  if (erro) return <p>Erro: {erro}</p>
  if (ideias.length === 0) return <p>Nenhum usuário encontrado.</p>

  return (
    <>
      <header>
        <h1>Banco de Ideias</h1>
        <p>Projeto P1 - PTAC4 . anotacao de ideias de projetos</p>
      </header>

      <div>
        <form onSubmit={enviar}>
          <h2>Nova Ideia</h2>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="App de receitas da vovó"
          />
          <button disabled={enviando}>Adicionar ideia</button>
          {enviando && <p>Enviando...</p>}
          {erro && <p>Erro: {erro}</p>}
          {criado && <p> Criado com id={criado.userId} e titulo={criado.titulo}.</p>}
        </form>
      </div>

      <section>
        <h1>Minhas ideias</h1>

        <div>
          {
            ideias.map((i) => (
              <>
                <h1>{i.title}</h1>
                <h1>{i.completed}</h1>
                <button>Marca executada</button>
                <button>Editar</button>
                <button>Excluir</button>
              </>

            )

            )}

        </div>
      </section>
    </>
  )
}
