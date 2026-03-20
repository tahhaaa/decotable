import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductActions } from "@/components/shop/product-actions";
import { getProductBySlug, getReviews } from "@/lib/data/store";
import { formatMAD } from "@/lib/utils";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  const item = product;
  const reviews = await getReviews(item.id);

  return (
    <div className="container-shell space-y-12 py-12">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-6 sm:grid-cols-2">
          {item.images.map((image) => (
            <div key={image} className="surface relative aspect-[4/5] overflow-hidden">
              <Image src={image} alt={item.name} fill className="object-cover" />
            </div>
          ))}
        </div>
        <div className="space-y-7">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-stone">{item.categoryName}</p>
            <h1 className="font-serif text-5xl leading-tight">{item.name}</h1>
            <p className="text-lg leading-8 text-stone">{item.description}</p>
          </div>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-semibold">{formatMAD(item.price)}</p>
            {item.compareAtPrice ? (
              <p className="pb-1 text-sm text-stone line-through">{formatMAD(item.compareAtPrice)}</p>
            ) : null}
          </div>
          <div className="grid gap-4 rounded-[2rem] border border-black/10 bg-white p-6 text-sm text-stone">
            <p>
              <span className="font-medium text-ink">Dimensions:</span> {item.dimensions}
            </p>
            <p>
              <span className="font-medium text-ink">Matieres:</span> {item.materials.join(", ")}
            </p>
            <p>
              <span className="font-medium text-ink">Stock:</span> {item.inventory} pieces disponibles
            </p>
          </div>
          <ProductActions productId={item.id} />
        </div>
      </div>

      <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-stone">Avis clients</p>
          <h2 className="section-title">Ce que nos clientes disent</h2>
        </div>
        <div className="grid gap-4">
          {reviews.map((review) => (
            <article key={review.id} className="surface p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{review.user_name}</p>
                <p className="text-sm text-stone">{review.rating}/5</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-stone">{review.comment}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
