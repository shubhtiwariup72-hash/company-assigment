const Loader = ({ fullScreen = false, size = "md", text = "" }) => {
  const sizes = { sm: "h-4 w-4 border-2", md: "h-8 w-8 border-2", lg: "h-12 w-12 border-3" };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizes[size]} rounded-full border-gray-200 border-t-blue-600 animate-spin`}
      />
      {text && <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      {spinner}
    </div>
  );
};

export default Loader;
