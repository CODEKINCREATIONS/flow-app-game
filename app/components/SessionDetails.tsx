"use client";

export const SessionDetails = () => {
  return (
    <div className="bg-[#1A1C33] text-white rounded-[0.8rem] border border-gray-700 shadow-lg p-6 px-[14px] mb-[30px] mt-[30px] mx-[30px]">
      <h2 className="text-xl font-semibold mb-6 border-l-4 border-purple-500 pl-4">
        Session Details
      </h2>

      <div className="grid grid-cols-3 gap-6 text-sm sm:text-base">
        <div>
          <p className="text-gray-400">Session Code</p>
          <p className="text-purple-400 font-semibold">11</p>
        </div>
        <div>
          <p className="text-gray-400">Status</p>
          <p className="text-green-500 font-semibold">Active</p>
        </div>
        <div>
          <p className="text-gray-400">Players Joined</p>
          <p className="font-semibold">1</p>
        </div>
      </div>
    </div>
  );
};
