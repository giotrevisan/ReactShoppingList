import { useRef, useState } from "react"
import type { Categoria, Produto } from "../types"
import { Armchair, Baby, Ban, Book, Car, Computer, Gamepad2, Handbag, Shirt, Star, Volleyball, WashingMachine } from "lucide-react"

function buscarIconeCategoria(categoria: Categoria) {
    const style = { color: '#7c7c7cff' }
    let icone = <Ban className="size-full" style={style} />
    switch (categoria.id) {
        case 1: icone = <Computer className="size-full" style={style} />; break
        case 2: icone = <WashingMachine className="size-full" style={style} />; break
        case 3: icone = <Volleyball className="size-full" style={style} />; break
        case 4: icone = <Baby className="size-full" style={style} />; break
        case 5: icone = <Car className="size-full" style={style} />; break
        case 6: icone = <Shirt className="size-full" style={style} />; break
        case 7: icone = <Handbag className="size-full" style={style} />; break
        case 8: icone = <Gamepad2 className="size-full" style={style} />; break
        case 9: icone = <Book className="size-full" style={style} />; break
        case 10: icone = <Armchair className="size-full" style={style} />; break
    }

    return (
        <div className="aspect-square w-full" >
            {icone}
        </div>
    )
}

export default function CardProduto({ produto, categoria, favorito, onFavClick, onClick }:
    {
        produto: Produto,
        categoria: Categoria,
        onClick: () => void,
        onFavClick: () => void,
        favorito: boolean
    }
) {
    const [mostrarFavorito, setMostrarBotaoFavorito] = useState<boolean>(false)
    const sobreFavorito = useRef<boolean>(false)

    return (
        <div className="aspect-3/4 border rounded-lg flex flex-col p-4 space-y-2 relative clicavel-effect bg-neutral-900 hover-effect"
            onMouseEnter={() => setMostrarBotaoFavorito(true)}
            onMouseLeave={() => setMostrarBotaoFavorito(false)}
            onClick={() => {
                if (sobreFavorito.current) {
                    return
                }

                onClick()
            }}
        >
            {buscarIconeCategoria(categoria)}
            <div className="grow">
                <p className="font-bold text-2xl truncate">{produto.nome ?? 'Nome desconhecido'}</p>
                <p className="truncate">{produto.preco ? `R\$ ${produto.preco}.00` : 'Preço não disponível'}</p >
            </div>
            <div className="absolute bottom-2 right-2">
                {(mostrarFavorito || favorito) &&
                    <Star className="hover-effect"
                        onClick={onFavClick}
                        style={{ color: favorito ? 'yellow' : 'white' }}
                        onMouseEnter={() => sobreFavorito.current = true}
                        onMouseLeave={() => sobreFavorito.current = false}
                    />}
            </div>
        </div>)
}
