// components/templates/Classic/thumbnail.tsx
export const ClassicThumbnail = () => {
  return (
    <div className="w-full aspect-[210/297] bg-white border border-gray-300 rounded overflow-hidden p-2 text-xs">
      <div className="border-b-2 border-black pb-1 mb-1">
        <div className="h-2 bg-gray-800 w-3/4 mb-0.5"></div>
        <div className="h-1 bg-gray-400 w-full"></div>
      </div>
      <div className="space-y-1">
        <div className="h-1 bg-gray-600 w-1/3"></div>
        <div className="h-1 bg-gray-300 w-full"></div>
        <div className="h-1 bg-gray-300 w-5/6"></div>
      </div>
    </div>
  );
};
