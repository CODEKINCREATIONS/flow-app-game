import AnimatedLock from "./AnimatedLock";

export default function LockPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Unlock the Lock</h1>
      <AnimatedLock />
    </main>
  );
}
