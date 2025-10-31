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
    <div
      className="bg-[#0D0F1A] text-white rounded-[0.8rem] border border-[#23263A] shadow-lg mx-auto max-w-7xl overflow-hidden p-[10px]"
      style={{ paddingLeft: "8px" }}
    >
      <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-4 sm:mb-6 border-l-4 border-[#7B61FF] pl-4 text-[#7CE3FF]">
        Session Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-sm sm:text-base">
        <div className="p-3 sm:pl-[10px] bg-[#0F1125]/50 rounded-lg">
          <p className="text-gray-400 mb-1">Session Code</p>
          <p className="text-white font-semibold truncate">
            {session?.code ?? session?.id ?? "—"}
          </p>
        </div>
        <div className="p-3 bg-[#0F1125]/50 rounded-lg">
          <p className="text-gray-400 mb-1">Status</p>
          <p className="text-[#7CE3FF] font-semibold">Active</p>
        </div>
        <div className="p-3 bg-[#0F1125]/50 rounded-lg">
          <p className="text-gray-400 mb-1">Players Joined</p>
          <p className="font-semibold">{session?.players?.length ?? 0}</p>
        </div>
      </div>
    </div>
  );
};
