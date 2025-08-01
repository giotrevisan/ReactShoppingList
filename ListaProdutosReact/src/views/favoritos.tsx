import { useContext, type ReactNode } from "react"
import { CategoriasContext, FavoritosContext } from "../context/context"
import CardProduto from "../components/cardProduto"
import type { Categoria, Produto } from "../types"

export default function ViewFavoritos({ mudarProdutoParaDetalhamento, abrirModal }: { mudarProdutoParaDetalhamento: (p: Produto) => void, abrirModal: () => void }) {
    const categorias = useContext(CategoriasContext)
    const favContext = useContext(FavoritosContext)

    if (!favContext) {
        throw new Error('Favoritos incorretamente inicializado')
    }

    const [dictFavoritos, , , removerFavorito] = favContext

    const componentesCategorias = categorias.map((x, indice) => {
        const favoritos = dictFavoritos[x.id]

        let conteudo: ReactNode | null = null
        if (!favoritos || favoritos.length == 0) {
            conteudo = <div className="h-full flex items-center">
                <p className="text-lg">Nada aqui ainda...</p>
            </div>
        }
        else {
            conteudo = favoritos.map((f, indice) => <CardProduto
                key={`favorito-${x.nome}-${indice}`}
                produto={f}
                categoria={categorias.find(c => c.id == f.categorias[0]) as Categoria}
                favorito={true}
                onFavClick={() => removerFavorito(f)}
                onClick={() => {
                    mudarProdutoParaDetalhamento(f)
                    abrirModal()
                }}
            />)
        }

        return (
            <div key={`categoria-${indice}`} className="flex flex-col space-y-2">
                <p className="text-3xl font-bold">{x.nome}</p>
                <div className="h-fit w-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6">
                    {conteudo ?? favoritos.map}
                </div>
            </div>
        )
    })

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="p-6 w-5/6 h-full space-y-6">
                {componentesCategorias}
            </div>
        </div>
    )
}