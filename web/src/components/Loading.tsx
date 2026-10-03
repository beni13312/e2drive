function Loading(){
    return (
        <div className="loading-container h-screen w-screen flex items-center justify-center">
            <div className="flex space-x-5 border-3 items-center border-gray-200 p-5 rounded-lg">
                <div className="loading-animation w-15 h-15 border-10 border-gray-200 border-t-cyan-400 rounded-full animate-spin"></div>
                <div className="loading-text text-2xl text-gray-600">
                    Loading...
                </div>
            </div>
        </div>
    );
}

export default Loading;