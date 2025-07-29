"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { Button } from "@/app/components/ui/button";

interface AlertModalProps {
  title?: string;
  description?: string;
  triggerText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function AlertModal({
  title = "Confirm Save",
  description = "Are you sure you want to save the file?",
  triggerText = "Save File",
  onConfirm,
  onCancel,
}: AlertModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">{triggerText}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end space-x-2">
          <AlertDialogAction onClick={onConfirm}>Yes</AlertDialogAction>
          <AlertDialogCancel asChild onClick={onCancel}>
            <Button variant="outline">No</Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
