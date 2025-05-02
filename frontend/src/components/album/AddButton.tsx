import { ImPlus } from "react-icons/im";

export function AddButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 bg-[#22BD9C] hover:bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition"
    >
      <ImPlus size={24} />
    </button>
  );
}
