"use client";

import { Button } from "@/components/ui/button";
import { PlusSquare, Upload } from "lucide-react";
import { useRouter } from "next/navigation"; // Import the useRouter hook

export default function Page() {
  const router = useRouter(); // Initialize the router

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
      // Redirect to the /reviews page after file selection
      router.push("/reviews");
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      {/* Button to create a new resume */}
      <Button asChild className="mx-auto flex w-fit gap-2">
        <a href="/editor">
          <PlusSquare className="size-5" />
          New resume
        </a>
      </Button>

      {/* Button to import a resume */}
      <label
        htmlFor="import-resume"
        className="mx-auto flex w-fit cursor-pointer gap-2"
      >
        <Button asChild>
          <div className="flex items-center gap-2">
            <Upload className="size-5" />
            Import resume
          </div>
        </Button>
        <input
          id="import-resume"
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>
    </main>
  );
}
