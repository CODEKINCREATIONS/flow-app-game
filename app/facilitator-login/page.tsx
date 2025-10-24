// app/facilitator-login/page.tsx
import Card from "@/app/components/ui/Card";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";

export default function FacilitatorLogin() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex flex-col flex-1 items-center justify-center px-4 py-8">
        {/* Main Title Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7B61FF] to-[#3A8DFF] mb-4">
            FLOW
          </h1>
          <p className="text-gray-300 mb-9 text-xl">Facilitator Login</p>
        </div>

        {/* Authorization Card */}
        <Card>
          <div className="space-y-10 w-full">
            {/* Card Title */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-2">
                Enter authorization code
              </h2>
            </div>

            {/* Input Section */}
            <div className="space-y-6 ">
              <Input placeholder="Enter your code here" />
            </div>

            {/* Button Section */}
            <div className="space-y-6 pt-4">
              <Button>Start Session</Button>
            </div>

            {/* Error Message */}
            <div className="text-center mt-6">
              <p className="text-xs text-red-400 font-medium">
                Code has already been used
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
