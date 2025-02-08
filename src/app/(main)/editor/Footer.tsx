import { Button } from "@/components/ui/button";
import Link from "next/link";
import { steps } from "./steps";
import { FileUserIcon, PenLineIcon, StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { reviewResume } from "./forms/actions";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ResumeValues } from "@/lib/validation";

interface FooterProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
  showSmResumePreview: boolean;
  setShowSmResumePreview: (show: boolean) => void;
  isSaving: boolean;
  resumeData: ResumeValues; // Replace 'any' with your actual resume data type
}

export default function Footer({
  currentStep,
  isSaving,
  setCurrentStep,
  showSmResumePreview,
  setShowSmResumePreview,
  resumeData,
}: FooterProps) {
  const router = useRouter();
  const [isReviewing, setIsReviewing] = useState(false);

  const { toast } = useToast();

  const previousStep = steps.find(
    (_, index) => steps[index + 1]?.key === currentStep,
  )?.key;

  const nextStep = steps.find(
    (_, index) => steps[index - 1]?.key === currentStep,
  )?.key;

  const handleReviewClick = async () => {
    try {
      setIsReviewing(true);
      const review = await reviewResume(resumeData);
      router.push(`/review?review=${encodeURIComponent(review)}`);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <footer className="w-full border-t px-3 py-5">
      <div className="max-7-xl mx-auto flex flex-wrap justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={
              previousStep ? () => setCurrentStep(previousStep) : undefined
            }
            disabled={!previousStep}
          >
            Previous Step
          </Button>
          <Button
            onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
            disabled={!nextStep}
          >
            Next Step
          </Button>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowSmResumePreview(!showSmResumePreview)}
          className="md:hidden"
          title={
            showSmResumePreview ? "Show input form" : "Show resume preview"
          }
        >
          {showSmResumePreview ? <PenLineIcon /> : <FileUserIcon />}
        </Button>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleReviewClick}
            disabled={isReviewing}
          >
            <StarIcon className="mr-2 h-4 w-4" />
            {isReviewing ? "Reviewing..." : "Review Resume"}
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/resumes">Close</Link>
          </Button>
          <p
            className={cn(
              "text-muted-foreground opacity-0",
              isSaving && "opacity-100",
            )}
          >
            Saving...
          </p>
        </div>
      </div>
    </footer>
  );
}
