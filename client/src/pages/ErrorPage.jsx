const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-red-50 to-green-50">
      
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg text-center bg-white border-l-8 border-green-500">
        
        {/* Error Icon - Dual Color */}
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full mb-6 bg-gradient-to-br from-red-100 to-green-100">
          <div className="relative h-16 w-16">
            <svg
              className="h-16 w-16 text-red-600 absolute inset-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <svg
              className="h-16 w-16 text-green-600 absolute inset-0 opacity-70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error Content */}
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
          Oops!
        </h1>
        
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Something went wrong
        </h2>
        
        <p className="text-gray-600 mb-6">
          We're having trouble processing your request. Please try again later or contact support if the problem persists.
        </p>
        
        <div className="flex justify-center space-x-4">
          <button
            className="px-4 py-2 rounded-md font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
          >
            Go Back
          </button>
          
          <button
            className="px-4 py-2 rounded-md font-medium text-white bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 transition-colors"
          >
            Home Page
          </button>
        </div>
        
        {/* Additional Help */}
        <div className="mt-6 text-sm bg-gradient-to-r from-red-500 to-green-500 bg-clip-text text-transparent">
          Need immediate help? <span className="underline cursor-pointer font-medium">Contact support</span>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 text-sm text-gray-500">
        © {new Date().getFullYear()} Quick Delivery App
      </div>
    </div>
  );
};

export default ErrorPage;