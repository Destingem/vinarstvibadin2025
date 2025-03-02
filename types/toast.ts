import { ReactNode } from "react";

export type Toast = {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  variant?: "default" | "destructive";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};
