import { ArticleView, articleMetadata, articleParams } from "@/components/ArticleView";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return articleParams("watches");
}
export async function generateMetadata({ params }: Props) {
  return articleMetadata((await params).slug, "watches");
}
export default async function Page({ params }: Props) {
  return <ArticleView slug={(await params).slug} section="watches" />;
}
