import React from "react";

const SkeletonProducts = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-4 animate-pulse">
      <div className="aspect-square bg-gray-200/60 rounded-xl mb-3" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200/60 rounded-full w-3/4" />
        <div className="h-3 bg-gray-200/60 rounded-full w-1/2" />
        <div className="h-4 bg-gray-200/60 rounded-full w-1/3" />
      </div>
    </div>
  );
};

export default SkeletonProducts;
