// components/templates/Minimal/thumbnail.tsx
export const MinimalThumbnail = () => {
  return (
    <div className="w-full aspect-[210/297] bg-white border border-gray-300 rounded overflow-hidden p-2 text-xs">
      <div className="mb-1">
        <div className="h-2 bg-gray-900 w-1/2 mb-0.5"></div>
        <div className="h-1 bg-gray-500 w-full"></div>
      </div>
      <div className="space-y-1">
        <div className="h-1 bg-gray-400 w-1/4"></div>
        <div className="h-1 bg-gray-200 w-full"></div>
        <div className="h-1 bg-gray-200 w-3/4"></div>
      </div>
    </div>
  );
};
