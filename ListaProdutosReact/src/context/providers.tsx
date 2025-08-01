import { useEffect, useRef, useState, type ReactNode } from "react"
import { CategoriasContext, FavoritosContext, type TFavoritos, type TFavoritosContext } from "./context"
import type { Categoria, Produto } from "../types"
import { fetchCategorias } from "../api"

export function FavoritosProvider({ children }: { children: ReactNode }) {
    const [dictFavoritos, setDictFavoritos] = useState<TFavoritos>({})
    const [favoritosDistintos, setFavoritosDistintos] = useState<Produto[]>([])

    const adicionarFavorito = (produto: Produto) => {
        setDictFavoritos(anterior => {
            const novoFavoritos: TFavoritos = { ...anterior }

            const produtosRemovidos: Produto[] = []
            for (const categoriaId of produto.categorias) {
                const lista = novoFavoritos[categoriaId] ? [...novoFavoritos[categoriaId]] : []

                if (!lista.find(x => x.id == produto.id)) {
                    lista.push(produto)
                    if (lista.length > 2) {
                        const produtoRemovido = lista.shift() as Produto
                        produtosRemovidos.push(produtoRemovido)
                    }

                    novoFavoritos[categoriaId] = lista
                }
            }

            let novosDistintos = [...favoritosDistintos]

            for (let i = 0; i < produtosRemovidos.length; i++) {
                const produto = produtosRemovidos[i]
                for (const categoriaId in novoFavoritos) {
                    novoFavoritos[categoriaId] = novoFavoritos[categoriaId].filter(
                        x => x.id !== produto!.id
                    )
                }

                if (novosDistintos.find(x => x.id == produto.id)) {
                    novosDistintos = novosDistintos.filter(x => x.id != produto.id)
                }
            }


            if (!novosDistintos.find(p => p.id == produto.id)) {
                novosDistintos.push(produto)
            }

            setFavoritosDistintos(novosDistintos)

            return novoFavoritos
        })
    }

    const removerFavorito = (produto: Produto) => {
        setDictFavoritos(anterior => {
            const novoFavoritos: TFavoritos = {}

            for (const [categoriaIdStr, produtos] of Object.entries(anterior)) {
                const categoriaId = Number(categoriaIdStr)
                const novaLista = produtos.filter(x => x.id !== produto.id)

                novoFavoritos[categoriaId] = novaLista
            }

            setFavoritosDistintos(anterior => anterior.filter(x => x.id != produto.id))

            return novoFavoritos
        })
    }

    const valor: TFavoritosContext = [dictFavoritos, favoritosDistintos, adicionarFavorito, removerFavorito]
    return <FavoritosContext.Provider value={valor}> {children} </FavoritosContext.Provider>
}

export default function Providers({ children }: { children: ReactNode }) {
    const [buscandoDados, setBuscandoDados] = useState<boolean>(true)
    const categorias = useRef<Categoria[]>([])

    const buscarDados = async () => {
        setBuscandoDados(true)

        // NOTA IMPORTANTE!!!!!!!!!!!!!!!!!
        // Os dados aqui nunca serão nulos, pois o backend é falso. Seria normal implementar uma checkagem pra ver
        // se o resultado do await é nulo, e apresentar ao usuário que o fetch falhou. Contudo, aqui eu só atribuí
        // à variável o resultado, sabendo que sempre conterá valores.
        categorias.current = await fetchCategorias()
        setBuscandoDados(false)
    }

    useEffect(() => {
        buscarDados()
    }, [])

    return (
        <CategoriasContext.Provider value={categorias.current}>
            <FavoritosProvider>
                {!buscandoDados && children}
            </FavoritosProvider>
        </CategoriasContext.Provider>
    )
}