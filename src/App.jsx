import { useState, useEffect } from "react";
import FormularioIdeia from "./components/FormularioIdeia";
import ListarIdeias from "./components/ListaIdeias";

const URL = "https://jsonplaceholder.typicode.com"

export default function App() {


  return (
    <body>
      <header>
        <h1>Banco de Ideias</h1>
        <p>Projeto P1 - PTAC4 . anotacao de ideias de projetos</p>
      </header>

      <FormularioIdeia></FormularioIdeia>

      <ListarIdeias></ListarIdeias>
    </body>
  )
}