const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col h-full animate-pulse">
      {/* Image Placeholder */}
      <div className="h-48 bg-gray-200 w-full"></div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          {/* Title Placeholder */}
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>

          {/* Description Placeholder */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>

        {/* Price & Action Placeholder */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          {/* Price */}
          <div className="h-6 bg-gray-200 rounded w-24"></div>

          {/* Button */}
          <div className="h-10 bg-gray-200 rounded-xl w-28"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
