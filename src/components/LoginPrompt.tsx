import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LoginPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action?: string;
}

export function LoginPrompt({ open, onOpenChange, action = "access this feature" }: LoginPromptProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-sm text-center">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <DialogTitle className="font-display text-xl">Sign in Required</DialogTitle>
          <DialogDescription className="text-sm">
            Create a free account or log in to {action}. It only takes a moment.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-2">
          <Link to="/login" onClick={() => onOpenChange(false)}>
            <Button className="w-full rounded-xl font-display">Log In</Button>
          </Link>
          <Link to="/signup" onClick={() => onOpenChange(false)}>
            <Button variant="outline" className="w-full rounded-xl font-display">Create Account</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
