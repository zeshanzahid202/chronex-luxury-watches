import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts, money, showcase } from "@/lib/products";
import { AddToCart, WishlistButton } from "@/components/shop-actions";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product: any = (await getProducts()).find((item: any) => item.slug === slug);
  return { title: product?.name || "Timepiece", description: product?.description };
}

export default async function Watch({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product: any = (await getProducts()).find((item: any) => item.slug === slug);
  if (!product) notFound();
  const available = product.stock - (product.reservedStock || 0);
  return <div className="shell">
    <div className="eyebrow" style={{ paddingTop: 28 }}>CHRONEX / {product.collection} / {product.reference}</div>
    <div className="detail-grid">
      <div className="detail-image"><img src={product.image} alt={product.name}/></div>
      <section className="detail-info">
        <span className="eyebrow">{product.collection} collection</span>
        <h1 className="display">{product.name}</h1>
        <div className="eyebrow" style={{ color: "#aaa69e" }}>Reference {product.reference}</div>
        <h2 style={{ fontSize: 18, fontWeight: 400, marginTop: 30 }}>{money(product.price, product.currency)}</h2>
        <p>{product.description}</p>
        <p>Availability: {available > 0 ? "Available to order" : "Currently unavailable"}</p>
        <AddToCart product={{ slug: product.slug, name: product.name, image: product.image, price: product.price }} disabled={available < 1}/>
        <WishlistButton slug={product.slug}/>
        <div className="spec-list">{[["Case material", product.material], ["Case diameter", product.diameter], ["Movement", product.movement], ["Dial", product.dial], ["Strap", product.strap], ["Water resistance", product.waterResistance]].map(([label, value]) => <div className="spec-row" key={label}><span>{label}</span><span>{value || "Details upon request"}</span></div>)}</div>
        <p style={{ fontSize: 10, color: "#88857f" }}>Fictional product content for development. No real certification or warranty claim is made.</p>
      </section>
    </div>
    <h2 className="display" style={{ fontSize: 38, marginBottom: 28 }}>You may also appreciate</h2>
    <div className="product-grid" style={{ paddingBottom: 100 }}>{showcase.filter(item => item.slug !== slug).slice(0, 3).map(item => <a className="product-card" href={`/watch/${item.slug}`} key={item.slug}><div className="product-image"><img src={item.image} alt={item.name}/></div><div className="product-meta"><span className="eyebrow">{item.collection}</span><h3>{item.name}</h3></div></a>)}</div>
  </div>;
}
