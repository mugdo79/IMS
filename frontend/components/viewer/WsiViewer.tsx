"use client";

interface WsiViewerProps {
  slideId: string;
}

export function WsiViewer({ slideId }: WsiViewerProps) {
  return (
    <div
      data-slide-id={slideId}
      className="flex h-full w-full items-center justify-center bg-black text-sm text-zinc-400"
    >
      WSI viewer placeholder (OpenSeadragon integration pending)
    </div>
  );
}
