interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label className="text-sm font-medium text-gray-300">{label}</label>
      )}
      <input
        {...props}
        className="px-5 pr-[21px] pt-[11px] pb-[11px]  bg-[#0F111A] border-2 border-[#2A2D3D] rounded-[0.3rem] text-white focus:outline-none focus:border-[#7B61FF] focus:ring-2 focus:ring-[#7B61FF] focus:ring-opacity-20 transition-all duration-300 placeholder-gray-500 text-lg"
      />
    </div>
  );
}
