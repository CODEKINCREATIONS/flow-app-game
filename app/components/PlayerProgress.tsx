"use client";

export const PlayerProgress = () => {
  return (
    <div className="bg-[#1A1C33] text-white rounded-[0.8rem] border border-gray-700 shadow-lg p-6 px-[14px] pb-[15px] mx-[30px]">
      <h2 className="text-xl font-semibold mb-6 border-l-4 border-purple-500 pl-4">
        Player Progress
      </h2>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="py-3 px-3">Name</th>
            <th className="py-3 px-3">Riddle Access</th>
            <th className="py-3 px-3">Attempt</th>
            <th className="py-3 px-3">Solved</th>
            <th className="py-3 px-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-b border-gray-800 hover:bg-[#24263A] transition-all duration-200 ease-in-out gap-4">
            <td className="py-3 px-3">Tanya</td>
            <td className="py-3 px-3">1</td>
            <td className="py-3 px-3">2</td>
            <td className="py-3 px-3 text-green-500 font-semibold">✔ Yes</td>
            <td className="py-3 px-3 text-center">
              <button className="bg-purple-600 hover:bg-purple-700 px-4 py-1.5 rounded-[0.8rem] text-sm font-medium transition-all duration-200">
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
