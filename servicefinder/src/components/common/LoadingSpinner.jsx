const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center w-full py-10">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
