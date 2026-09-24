import { useState, useEffect } from "react";

const URL = "https://jsonplaceholder.typicode.com"

export default function FormularioIdeia(){

  return (
    <div>
        <form action="">
            <h1>Nova Ideia</h1>
            <p>Título</p>
            <input type="text" placeholder="teste"/>
            <button>Adicionar ideia</button>
        </form>
    </div>
  )
}