const LoaderProducts = ({ text }: { text?: string }) => (
  <div className="flex flex-col items-center gap-3">
    <div className="relative">
      <div className="h-8 w-8 rounded-full border-2 border-green-200/50 border-t-green-600 animate-spin" />
      <div className="absolute inset-0 h-8 w-8 rounded-full border-2 border-transparent border-t-green-400/30 animate-pulse" />
    </div>
    {text && (
      <span className="text-sm text-gray-400 font-medium animate-pulse">
        {text}
      </span>
    )}
  </div>
);

export default LoaderProducts;
