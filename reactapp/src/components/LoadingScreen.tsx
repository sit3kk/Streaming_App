const LoadingScreen = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm flex justify-center items-center">
        <div
          className="w-24 h-24 border-b-8 border-purple-700 rounded-full animate-spin"
          style={{ borderTopColor: 'transparent' }}
        ></div>
      </div>
    );
  };
  
  export default LoadingScreen;
  
