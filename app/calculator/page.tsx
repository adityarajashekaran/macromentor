import React from "react";
import { Calculator } from "@/components/calculator";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80 py-12">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          <ThemeToggle />
        </div>
        <h1 className="text-3xl font-bold text-center mb-8">Calculate Your Macros</h1>
        <Calculator />
      </div>
    </main>
  );
} 