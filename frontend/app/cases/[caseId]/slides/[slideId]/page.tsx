import { AnnotationOverlay } from "@/components/annotations/AnnotationOverlay";
import { WsiViewer } from "@/components/viewer/WsiViewer";

export default async function SlideViewerPage({
  params,
}: {
  params: Promise<{ caseId: string; slideId: string }>;
}) {
  const { slideId } = await params;

  return (
    <main className="relative h-screen w-full">
      <WsiViewer slideId={slideId} />
      <AnnotationOverlay slideId={slideId} />
    </main>
  );
}
