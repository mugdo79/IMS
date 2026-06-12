interface AnnotationOverlayProps {
  slideId: string;
}

export function AnnotationOverlay({ slideId }: AnnotationOverlayProps) {
  return <div data-slide-id={slideId} className="pointer-events-none absolute inset-0" />;
}
