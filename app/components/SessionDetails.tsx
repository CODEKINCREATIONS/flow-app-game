"use client";

import { useSession } from "@/app/lib/hooks";

export const SessionDetails = () => {
  const { session } = useSession();

  const statusColor = (status?: string) => {
    if (!status) return "text-gray-300";
    switch (status) {
      case "active":
      case "Active":
        return "text-[#7CE3FF] font-semibold"; // neon blue/cyan for Active
      case "completed":
      case "Completed":
        return "text-yellow-400 font-semibold";
      case "pending":
      case "Pending":
        return "text-[#FFD60A] font-semibold"; // neon yellow-ish
      default:
        return "text-gray-300 font-semibold";
    }
  };

  return (
    <div className="bg-[#0D0F1A] text-white rounded-[0.8rem] border border-[#23263A] shadow-lg mx-auto max-w-7xl overflow-hidden p-[10px]">
      <h2 className="text-xs sm:text-sm md:text-base font-semibold text-[#7CE3FF] mb-[6px] border-l-4 border-[#7B61FF] pl-[8px]">
        Session Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[6px]">
        <div className="bg-[#0e1020] rounded-[1px] p-[8px]">
          <p className="text-gray-400 text-xs mb-[4px]">Session Code</p>
          <p className="text-white font-semibold truncate text-xs">
            {session?.code ?? session?.id ?? "—"}
          </p>
        </div>
        <div className="bg-[#0e1020] rounded-[1px] p-[8px]">
          <p className="text-gray-400 text-xs mb-[4px]">Status</p>
          <p className="text-[#7CE3FF] font-semibold text-xs">Active</p>
        </div>
        <div className="bg-[#0e1020] rounded-[1px] p-[8px]">
          <p className="text-gray-400 text-xs mb-[4px]">Players Joined</p>
          <p className="font-semibold text-xs">
            {session?.players?.length ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
};
