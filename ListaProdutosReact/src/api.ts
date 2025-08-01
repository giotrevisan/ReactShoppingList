import categoriasData from './categorias.json'
import produtosData from './produtos_com_variacoes.json'
import type { Categoria, Produto } from './types'

export const QTE_PRODUTOS_POR_PAGINA: number = 28

// Função de uso interno para a criação de uma promise com variação em tempo de resposta
function _criarPromiseComAtraso<T>(fonte: T, tempoBase: number): Promise<T> {
    const variacao: number = Math.random() * 250 + 250 // Variação de [0.25, 0.5[ (0.5 exclusivo) seg.

    return new Promise<T>((resolve) => {
        setTimeout(() => {
            resolve(fonte)
        }, tempoBase + variacao)
    })
}

export function fetchCategorias(): Promise<Categoria[]> {
    return _criarPromiseComAtraso(categoriasData, 150)
}

export function fetchPaginaProdutos(pagina: number): Promise<Produto[]> {

    // Assuma que todo esse calculo ocorre no backend. Aqui eu to fazendo só pra
    // evitar um IndexOutOfRange (ou erro similar do JS).
    const qtePaginas = Math.ceil(produtosData.length / QTE_PRODUTOS_POR_PAGINA)
    if (pagina < 0 || pagina > qtePaginas - 1) {
        return _criarPromiseComAtraso([], 0) // Nenhum delay base + jitter pois não houve processamento de dados do banco de dados teórico
    }

    const inicio = pagina * QTE_PRODUTOS_POR_PAGINA
    const resultadoBanco = produtosData.slice(inicio, inicio + QTE_PRODUTOS_POR_PAGINA)

    return _criarPromiseComAtraso(resultadoBanco, 200)
}

export function fetchQuantidadePaginasProdutos(): Promise<number> {
    const qtePaginas = Math.ceil(produtosData.length / QTE_PRODUTOS_POR_PAGINA)
    return _criarPromiseComAtraso(qtePaginas, 100)
}