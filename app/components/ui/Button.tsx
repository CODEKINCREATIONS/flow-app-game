interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="w-full rounded-xl text-white font-bold bg-gradient-to-r from-[#7B61FF] to-[#3A8DFF] hover:shadow-glow hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-[#7B61FF] border-opacity-30 flex items-center justify-center"
      style={{
        height: "24.6px",
        paddingTop: "20px",
        paddingBottom: "20px",
        marginTop: "20px",
        fontSize: "1.125rem", // text-lg equivalent
        borderRadius: "0.3rem",
      }}
    >
      {children}
    </button>
  );
}
