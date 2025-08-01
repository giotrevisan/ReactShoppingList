
import { useContext, useEffect, useRef, useState } from "react"
import type { Categoria, Produto } from "../types"
import { fetchPaginaProdutos, QTE_PRODUTOS_POR_PAGINA } from "../api"
import { Skeleton } from "../components/ui/skeleton"
import { ChevronLeft, ChevronRight } from "lucide-react"
import CardProduto from "../components/cardProduto"
import { CategoriasContext, FavoritosContext } from "../context/context"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ViewProdutos({ qtePaginas, pagina, mudarPagina, mudarProdutoParaDetalhamento, abrirModal }:
    {
        qtePaginas: number,
        pagina: number,
        mudarPagina: (x: number) => void,
        mudarProdutoParaDetalhamento: (p: Produto) => void,
        abrirModal: () => void
    }
) {
    const categorias = useContext(CategoriasContext)
    const favContext = useContext(FavoritosContext)

    if (!favContext) {
        throw new Error('Favoritos incorretamente inicializado')
    }

    const [_, favoritosDistintos, adicionarFavorito, removerFavorito] = favContext

    const [produtos, setProdutos] = useState<Produto[]>([])
    const [buscandoProdutos, setBuscandoProdutos] = useState<boolean>(false)
    const [categoriaFiltragem, setCategoriaFiltragem] = useState<string>('')

    const timeoutProcessarMudanca = useRef<NodeJS.Timeout | null>(null)

    const buscarProdutos = async (novaPagina: number) => {
        setBuscandoProdutos(true)
        const produtos = await fetchPaginaProdutos(novaPagina)
        setProdutos(produtos)
        setBuscandoProdutos(false)
    }

    // Evitar spam e múltiplos re-renders
    useEffect(() => {
        if (timeoutProcessarMudanca.current) {
            clearTimeout(timeoutProcessarMudanca.current)
        }

        timeoutProcessarMudanca.current = setTimeout(() => {
            buscarProdutos(pagina)
        }, 500)
    }, [pagina])

    const botaoAvancarAtivo = pagina != qtePaginas - 1
    const botaoRecuarAtivo = pagina > 0
    const componentesProdutos = buscandoProdutos ? null : produtos.map((x, indice) => {
        const favorito = favoritosDistintos.findIndex(p => p.id == x.id) != -1;

        if (categoriaFiltragem != '' && categoriaFiltragem != '-1' && !!!x.categorias.find(id => id == parseInt(categoriaFiltragem))) {
            return null
        }

        return <CardProduto
            key={`${indice}`}
            produto={x}
            categoria={categorias.find(c => c.id == x.categorias[0]) as Categoria}
            favorito={favorito}
            onFavClick={() => {
                if (favorito) {
                    removerFavorito(x)
                }
                else {
                    adicionarFavorito(x)
                }
            }}
            onClick={() => {
                mudarProdutoParaDetalhamento(x)
                abrirModal()
            }}
        />
    })

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-5/6 h-full">
                <div className="flex w-full justify-end p-6">
                    <Select value={categoriaFiltragem} onValueChange={setCategoriaFiltragem}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtrar por categoria" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Categorias</SelectLabel>
                                <SelectItem value="-1">Todas</SelectItem>
                                {categorias.map(x => <SelectItem key={x.id} value={`${x.id}`}>{x.nome}</SelectItem>)}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6 pb-6 pl-6 pr-6">
                    {buscandoProdutos && Array.from({ length: QTE_PRODUTOS_POR_PAGINA }).map((_, indice) => <Skeleton key={`${indice}`} className="aspect-3/4" />)}
                    {componentesProdutos}
                </div>
            </div>

            <div className="fixed bottom-4 right-4 z-50 flex justify-end">
                <div className='flex justify-center space-y-2 items-center'>
                    <div className="flex space-x-2">
                        <button className={`flex items-center justify-center p-2 bg-[#222222] ${botaoRecuarAtivo ? 'hover-effect' : 'brightness-50'} border rounded-sm`}
                            onClick={() => {
                                if (pagina == 0) {
                                    return
                                }

                                mudarPagina(pagina - 1)
                            }}
                        >
                            <ChevronLeft />
                        </button>
                        <button className={`flex items-center justify-center p-2 bg-[#222222] ${botaoAvancarAtivo ? 'hover-effect' : 'brightness-50'} border rounded-sm`}
                            onClick={() => {
                                if (pagina == qtePaginas - 1) {
                                    return
                                }

                                mudarPagina(pagina + 1)
                            }}
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}