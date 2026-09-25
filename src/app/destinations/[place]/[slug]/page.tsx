import { ArticleView, articleMetadata, articleParams } from "@/components/ArticleView";

type Props = { params: Promise<{ place: string; slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return articleParams("destinations");
}
export async function generateMetadata({ params }: Props) {
  return articleMetadata((await params).slug, "destinations");
}
export default async function Page({ params }: Props) {
  const { place, slug } = await params;
  return <ArticleView slug={slug} section="destinations" place={place} />;
}
