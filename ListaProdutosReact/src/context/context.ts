import { createContext } from "react"
import type { Categoria, Produto } from "../types"

export type TFavoritos = { [id: number]: Produto[] }
export type TFavoritosContext = [TFavoritos, Produto[], (p: Produto) => void, (p: Produto) => void]

export const CategoriasContext = createContext<Categoria[]>([])
export const FavoritosContext = createContext<TFavoritosContext | null>(null)