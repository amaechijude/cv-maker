export const ProfessionalThumbnail = () => {
  return (
    <div className="w-full aspect-[210/297] bg-white border border-gray-300 rounded overflow-hidden p-2 text-[6px]">
      <div className="border-b-2 border-gray-800 pb-1 mb-2">
        <div className="h-3 bg-gray-900 w-1/2 mb-1"></div>
        <div className="h-1 bg-gray-400 w-full"></div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 space-y-2">
          <div className="h-1 bg-gray-300 w-full"></div>
          <div className="h-1 bg-gray-300 w-full"></div>
          <div className="pt-1 border-t border-gray-200">
            <div className="h-2 bg-gray-800 w-1/3 mb-1"></div>
            <div className="h-1 bg-gray-200 w-full"></div>
            <div className="h-1 bg-gray-200 w-4/5"></div>
          </div>
        </div>
        <div className="col-span-1 space-y-2">
          <div className="h-2 bg-gray-800 w-full mb-1"></div>
          <div className="h-1 bg-gray-100 w-full"></div>
          <div className="h-1 bg-gray-100 w-full"></div>
          <div className="h-1 bg-gray-100 w-full"></div>
        </div>
      </div>
    </div>
  );
};
