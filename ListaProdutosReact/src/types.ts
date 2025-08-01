export interface Categoria {
    id: number
    nome: string
}

export interface VariacaoProduto {
    estoque: string
    vendedor: string
    fabricante: string
    cor: string
    voltagem: string
    tamanho: string
    garantia: string
    peso: string | null
    dimensoes: string | null
}

export interface Produto {
    id: number
    nome: string | null
    categorias: number[]
    preco: string | null
    descricao: string
    variacao: VariacaoProduto[]
}
