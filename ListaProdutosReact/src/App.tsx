import { useContext, useEffect, useRef, useState } from 'react'
import { Star } from 'lucide-react'
import ViewProdutos from './views/produtos'
import ViewFavoritos from './views/favoritos'
import { fetchQuantidadePaginasProdutos } from './api'
import { FavoritosContext } from './context/context'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from './components/ui/dialog'
import type { Produto } from './types'

type views = 'produtos' | 'favoritos'

function BarraSuperior({ mudarView, qteFavoritos }: { mudarView: (x: views) => void, qteFavoritos: number }
) {
    return (
        <div className="w-full h-fit sticky top-0 border-b z-50 flex justify-between p-4 backdrop-blur-xs backdrop-brightness-50">
            <div className="space-x-2 flex items-center">
                <a className="hover-effect underline text-sm hover: cursor-pointer" onClick={() => mudarView('produtos')}>Produtos</a>
                <a className="hover-effect underline text-sm hover: cursor-pointer" onClick={() => mudarView('favoritos')}>Favoritos</a>
            </div>
            <div className="flex space-x-1 items-center">
                <Star />
                <p>{qteFavoritos} </p>
            </div>
        </div>
    )
}

export default function App() {
    const [viewAtiva, setViewAtiva] = useState<views>('produtos')
    const [pagina, setPagina] = useState<number>(0)

    const favContext = useContext(FavoritosContext)

    if (!favContext) {
        throw new Error('Favoritos incorretamente inicializado')
    }

    const [_, favoritosDistintos, adicionarFavorito, removerFavorito] = favContext

    const [modalAberto, setModalAberto] = useState<boolean>(false)
    const [produtoParaDetalhamento, setProdutoParaDetalhamento] = useState<Produto | null>(null)

    const [buscandoDados, setBuscandoDados] = useState<boolean>(true)
    const qtePaginas = useRef<number>(0)

    const buscarDados = async () => {
        setBuscandoDados(true)
        qtePaginas.current = await fetchQuantidadePaginasProdutos()
        setBuscandoDados(false)
    }

    useEffect(() => {
        // Modo escuro por padrão-adicionar modo claro depois?
        document.body.classList.add('dark')

        buscarDados()
    }, [])

    const componentesVariacoes = produtoParaDetalhamento == null ? null : produtoParaDetalhamento.variacao.map((x, indice) => {
        return (
            <div key={`variacao-produto-${produtoParaDetalhamento.id}-${indice}`}>
                <h1 className="text-lg">{`Variante ${indice + 1}`}</h1>
                <div className="bg-neutral-900 rounded p-4 w-full h-fit flex space-x-6">
                    <div className="w-fit">
                        <p>Cor</p>
                        <p>Dimensões</p>
                        <p>Estoque</p>
                        <p>Fabricante</p>
                        <p>Garantia</p>
                        <p>Peso</p>
                        <p>Tamanho</p>
                        <p>Vendedor</p>
                        <p>Voltagem</p>
                    </div>
                    <div className="grow">
                        <p>{x.cor}</p>
                        <p>{x.dimensoes ?? 'Dimensões desconhecidas'}</p>
                        <p>{x.estoque}</p>
                        <p>{x.fabricante}</p>
                        <p>{x.garantia}</p>
                        <p>{x.peso ?? 'Peso desconhecido'}</p>
                        <p>{x.tamanho}</p>
                        <p>{x.vendedor}</p>
                        <p>{x.voltagem}</p>
                    </div>
                </div>
            </div>
        )
    })

    const view = viewAtiva == 'favoritos' ?
        <ViewFavoritos abrirModal={() => setModalAberto(true)}
            mudarProdutoParaDetalhamento={setProdutoParaDetalhamento} /> :
        <ViewProdutos qtePaginas={qtePaginas.current}
            pagina={pagina}
            mudarPagina={setPagina}
            mudarProdutoParaDetalhamento={setProdutoParaDetalhamento}
            abrirModal={() => setModalAberto(true)} />

    return (
        <div>
            <BarraSuperior mudarView={setViewAtiva} qteFavoritos={favoritosDistintos.length} />
            <div className='w-full h-full'>
                <Dialog open={modalAberto} onOpenChange={setModalAberto}>
                    <div className='overflow-y-auto'>
                        {!buscandoDados && view}
                    </div>
                    <DialogContent className="min-w-1/3 min-h-1/3">
                        <DialogTitle className="text-2xl font-bold">{produtoParaDetalhamento?.nome ?? 'Nome desconhecido'}</DialogTitle>
                        <DialogDescription>{produtoParaDetalhamento?.preco ? `R\$ ${produtoParaDetalhamento.preco}.00` : 'Preço não disponível'}</DialogDescription>
                        <div className="space-y-6 h-128 overflow-y-auto">
                            {componentesVariacoes}
                        </div>
                        <DialogFooter className="flex justify-end">
                            <Star className="hover-effect"
                                onClick={() => {
                                    const prod = produtoParaDetalhamento as Produto
                                    if (favoritosDistintos.findIndex(x => x.id == produtoParaDetalhamento?.id) != -1) {
                                        removerFavorito(prod)
                                    }
                                    else {
                                        adicionarFavorito(prod)
                                    }
                                }}
                                style={{ color: favoritosDistintos.findIndex(x => x.id == produtoParaDetalhamento?.id) != -1 ? 'yellow' : 'white' }}
                            />
                        </DialogFooter>
                    </DialogContent>
                </Dialog >
            </div >
        </div>
    )
}
