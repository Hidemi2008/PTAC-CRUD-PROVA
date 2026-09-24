import { useState, useEffect } from "react";
import CartaoIdeia from "./CartaoIdeia";

const URL = "https://jsonplaceholder.typicode.com"

export default function ListarIdeias(){


  return (
    <section>
        <h1>Minhas Ideias</h1>

        <CartaoIdeia></CartaoIdeia>
    </section>
  )
}