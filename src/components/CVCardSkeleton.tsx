export const CVCardSkeleton = () => (
  <div className="bg-surface-container-low p-8 rounded-xl animate-pulse">
    <div className="flex items-center gap-2 mb-6">
      <div className="w-2 h-2 rounded-full bg-primary/20" />
      <div className="h-2 bg-primary/10 rounded w-24"></div>
    </div>
    
    <div className="h-10 bg-primary/10 rounded w-3/4 mb-4"></div>
    
    <div className="space-y-3 mb-8">
      <div className="h-4 bg-primary/5 rounded w-1/2"></div>
      <div className="h-3 bg-primary/5 rounded w-1/3"></div>
    </div>

    <div className="flex gap-2 pt-6 border-t border-outline-variant/5">
      <div className="h-10 bg-primary/10 rounded flex-1"></div>
      <div className="h-10 bg-primary/10 rounded w-10"></div>
      <div className="h-10 bg-primary/10 rounded w-10"></div>
    </div>
  </div>
);
