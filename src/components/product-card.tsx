import Link from "next/link";
import { money } from "@/lib/money";
type Item={slug:string;name:string;collection:string;price:number;currency?:string;image:string;description:string};
export function ProductCard({product}:{product:Item}){return <article className="product-card"><Link href={`/watch/${product.slug}`}><div className="product-image"><img src={product.image} alt={`${product.name} timepiece`} loading="lazy"/></div><div className="product-meta"><span className="eyebrow">{product.collection}</span><span className="product-price">{money(product.price,product.currency)}</span><h3>{product.name}</h3><p>{product.description}</p></div></Link></article>}
