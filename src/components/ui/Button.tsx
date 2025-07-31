import Link from "next/link";

export default function Button() {
  return (
    <div className="hidden md:flex items-center">
      <button className="bg-blue-600 hover:bg-blue-800 cursor-pointer text-white px-8 py-2 rounded-full font-medium hover:from-white hover:to-gray-50 transition-all duration-200 backdrop-blur-sm border border-white/20">
        <Link href={"/shop"}>Shop Now</Link>
      </button>
    </div>
  );
}
