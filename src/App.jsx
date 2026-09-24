import { useState, useEffect } from "react";

const URL = "https://jsonplaceholder.typicode.com/todos"

export default function App() {
  const [ideias, setIdeias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    const controle = new AbortController()  // cria um controle
    const signal = controle.signal


    async function buscar() {
      try {
        setCarregando(true)
        setErro(null)
        const resp = await fetch(URL, { signal })
        if (!resp.ok) {
          // 4xx ou 5xx — fetch NÃO rejeita para esses status! Precisamos lançar à mão.
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
        <form action="">
          <h1>Nova Ideia</h1>
          <p>Título</p>
          <input type="text" placeholder="teste" />
          <button>Adicionar ideia</button>
        </form>
      </div>

      <section>
        <h1>Minhas ideias</h1>

        <div>
          <h1>{ideias.title}</h1>
          <p>{ideias.completed}</p>
          <button>Marca executada</button>
          <button>Editar</button>
          <button>Excluir</button>
        </div>
      </section>
    </>
  )
}