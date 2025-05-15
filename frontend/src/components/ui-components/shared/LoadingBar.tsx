export const LoadingBar = () => {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
      <div className="flex flex-col items-center">
        <div className="flex space-x-1">
          <div
            className="w-2 h-2 bg-[#22BD9C] rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-2 h-2 bg-[#22BD9C] rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-[#22BD9C] rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
        <span className="text-sm text-[#22BD9C] mt-2">로딩 중...</span>
      </div>
    </div>
  );
};
