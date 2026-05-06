import Link from "next/link";
import { notFound } from "next/navigation";

import { bottles, findBottleBySlug } from "../../data/distilleries";

type BottleDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return bottles.map((bottle) => ({
    slug: bottle.slug,
  }));
}

export async function generateMetadata({ params }: BottleDetailPageProps) {
  const { slug } = await params;
  const bottle = findBottleBySlug(slug);

  return {
    title: bottle ? `${bottle.name} | Whisky Journey` : "Bottle | Whisky Journey",
  };
}

export default async function BottleDetailPage({ params }: BottleDetailPageProps) {
  const { slug } = await params;
  const bottle = findBottleBySlug(slug);

  if (!bottle) {
    notFound();
  }

  return (
    <main className="appShell detailShell">
      <section className="detailHero" aria-labelledby="bottle-title">
        <Link className="backLink" href="/">
          ← 候補に戻る
        </Link>
        <p className="sectionKicker">Bottle Detail</p>
        <h1 id="bottle-title">{bottle.name}</h1>
        <dl className="detailMeta">
          <div>
            <dt>蒸留所</dt>
            <dd>{bottle.distillery}</dd>
          </div>
          <div>
            <dt>地域</dt>
            <dd>{bottle.region}</dd>
          </div>
        </dl>
      </section>

      <section className="detailCard" aria-labelledby="taste-title">
        <p className="sectionKicker">Taste</p>
        <h2 id="taste-title">味の特徴</h2>
        <p>{bottle.tasteProfile}</p>
      </section>

      <section className="detailCard" aria-labelledby="for-title">
        <p className="sectionKicker">For You</p>
        <h2 id="for-title">こういう人向け</h2>
        <p>{bottle.recommendedFor}</p>
      </section>
    </main>
  );
}
