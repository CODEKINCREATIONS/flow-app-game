"use client";

import { Button } from "@/app/components/ui";
import { useSession } from "@/app/lib/hooks";

export const PlayerProgress = () => {
  const { session } = useSession();

  const solveColor = (status: string) => {
    switch (status) {
      case "Yes":
      case "Solved":
      case "✔ Yes":
        return "text-[#39FF14] font-semibold"; // neon green
      case "Failed":
      case "No":
        return "text-red-400 font-semibold";
      case "Inprogress":
      case "In Progress":
        return "text-[#FFD60A] font-semibold"; // neon yellow
      default:
        return "text-gray-300";
    }
  };

  // temporary sample players if session has none
  const players = session?.players ?? [
    { id: "1", name: "Tanya", activeRiddle: 1, attempt: 2, solved: "Yes" },
    {
      id: "2",
      name: "Alex",
      activeRiddle: 2,
      attempt: 1,
      solved: "In Progress",
    },
  ];

  return (
    <div className="bg-[#0D0F1A] text-white rounded-[0.8rem] border border-[#23263A] shadow-lg p-4 sm:p-6 mx-auto max-w-7xl overflow-x-auto p-[10px]">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-4 sm:mb-6 border-l-4 border-[#7B61FF] pl-4 text-[#7CE3FF] sticky left-0">
        Player Progress
      </h2>

      <div className="min-w-[650px]">
        <table className="w-full text-left border-collapse text-base sm:text-lg">
          <thead>
            <tr className="text-gray-300 border-b border-[#2A2D3D]">
              <th className="py-[10px] px-4 my-[2px] font-semibold">Name</th>
              <th className="py-[10px] px-4 my-[2px] font-semibold">
                Active Riddle
              </th>
              <th className="py-[10px] px-4 my-[2px] font-semibold">Attempt</th>
              <th className="py-[10px] px-4 my-[2px] font-semibold">Solved</th>
              <th className="py-[10px] px-4 my-[2px] font-semibold ">Action</th>
            </tr>
          </thead>

          <tbody>
            {players.map((p: any) => (
              <tr
                key={p.id}
                className="border-b border-[#1F2130] bg-[#0D0F1A] hover:bg-[#081025] transition-all duration-200"
              >
                <td className="py-4 px-4 text-[#D1D5DB] font-medium">
                  {p.name}
                </td>
                <td className="py-4 px-4 text-[#D1D5DB]">
                  {p.activeRiddle ?? p.riddleAccess ?? "—"}
                </td>
                <td className="py-4 px-4 text-[#D1D5DB]">{p.attempt ?? "—"}</td>
                <td className={`py-4 px-4 ${solveColor(p.solved)}`}>
                  {p.solved === "Yes" ? "✔ Yes" : p.solved}
                </td>
                <td className="py-4 px-4 text-center">
                  <Button
                    variant="neon"
                    className="!px-6 !py-2 text-sm hover:scale-105 transition-transform"
                    onClick={() => alert(`Open details for ${p.name}`)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
