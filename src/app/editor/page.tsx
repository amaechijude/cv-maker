"use client";

import { Suspense } from "react";
import { useCVStore } from "@/store/useCVStore";
import { useSearchParams, redirect } from "next/navigation";
import { EditorComponent } from "@/components/Editor";

export default function GetCv() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <EditorContent />
    </Suspense>
  );
}

function EditorContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  const { cvs } = useCVStore();
  if (!id) {
    redirect("/");
    return null;
  }

  const cv = cvs.find((c) => c.id === id);

  if (!cv) {
    redirect("/");
    return null;
  }

  return <>
  <EditorComponent cv={cv} />
  </>;
}

