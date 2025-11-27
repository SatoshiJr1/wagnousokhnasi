const AstuceSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex gap-4 items-start animate-pulse">
      {/* Image Placeholder */}
      <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-200"></div>

      {/* Content Placeholder */}
      <div className="flex-grow">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>

        {/* Content */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
};

export default AstuceSkeleton;
