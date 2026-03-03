export const CreativeThumbnail = () => {
  return (
    <div className="w-full aspect-[210/297] bg-white border border-gray-300 rounded overflow-hidden flex text-[6px]">
      <div className="w-1/3 bg-gray-900 p-2 flex flex-col space-y-2">
        <div className="h-4 bg-blue-400 w-full mb-1"></div>
        <div className="h-1 bg-gray-600 w-full"></div>
        <div className="h-1 bg-gray-600 w-full"></div>
        <div className="mt-4 space-y-1">
          <div className="h-1 bg-blue-900 w-1/2"></div>
          <div className="h-1 bg-gray-700 w-full"></div>
          <div className="h-1 bg-gray-700 w-full"></div>
        </div>
      </div>
      <div className="w-2/3 p-3 space-y-3">
        <div className="h-2 bg-gray-200 w-1/4 mb-1"></div>
        <div className="h-4 bg-gray-50 border-l-2 border-blue-500 w-full mb-4"></div>
        <div className="space-y-2">
           <div className="h-2 bg-gray-200 w-1/4 mb-1"></div>
           <div className="flex justify-between">
              <div className="h-3 bg-gray-800 w-1/2"></div>
              <div className="h-2 bg-blue-100 w-1/4"></div>
           </div>
           <div className="h-1 bg-gray-200 w-full"></div>
           <div className="h-1 bg-gray-200 w-full"></div>
        </div>
      </div>
    </div>
  );
};
