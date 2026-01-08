// components/templates/Modern/thumbnail.tsx
export const ModernThumbnail = () => {
  return (
    <div className="w-full aspect-210/297 bg-white border border-gray-300 rounded overflow-hidden p-2 text-xs">
      <div className="bg-blue-100 p-1 mb-1 rounded">
        <div className="h-2 bg-blue-800 w-2/3 mb-0.5"></div>
        <div className="h-1 bg-blue-600 w-full"></div>
      </div>
      <div className="space-y-1">
        <div className="h-1 bg-blue-500 w-1/3"></div>
        <div className="h-1 bg-gray-300 w-full"></div>
        <div className="h-1 bg-gray-300 w-4/5"></div>
      </div>
    </div>
  );
};
