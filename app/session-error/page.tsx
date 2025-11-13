"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SessionErrorContent() {
  const searchParams = useSearchParams();
  const errorMessage =
    searchParams.get("error") || "Invalid or expired session";

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-2xl w-full text-center">
        <p className="text-gray-300 text-lg leading-relaxed">{errorMessage}</p>
      </div>
    </main>
  );
}

export default function SessionErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SessionErrorContent />
    </Suspense>
  );
}
