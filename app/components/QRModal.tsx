"use client";
import Image from "next/image";

interface QRModalProps {
  show: boolean;
  onClose: () => void;
}

export const QRModal = ({ show, onClose }: QRModalProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-[#1A1C33] p-8 rounded-2xl text-center shadow-lg relative w-[90%] sm:w-[400px] animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
        >
          ✖
        </button>
        <h3 className="text-xl font-semibold mb-4 text-white">
          Session QR Code
        </h3>
        <Image
          src="/assets/qr-placeholder.png"
          alt="QR Code"
          width={200}
          height={200}
          className="mx-auto"
        />
        <p className="text-gray-400 mt-3">Scan this QR to join the session</p>
      </div>
    </div>
  );
};
