"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const review = searchParams.get("review");

  if (!review) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>No review found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Please generate a review from the resume editor.</p>
            <Button asChild>
              <Link href="/resumes">Back to Resumes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [scoreSection, ...otherSections] = review.split("\n\n");
  const score = scoreSection.replace("SCORE: ", "");

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Resume Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Score: {score}</h2>
            <Button asChild variant="outline">
              <Link href="/editor">Back to Editor</Link>
            </Button>
          </div>
          <div className="whitespace-pre-line">
            {otherSections.join("\n\n")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
