"use client";

import { Suspense } from "react";
import { useCVStore } from "@/store/useCVStore";
import { useSearchParams, useRouter } from "next/navigation";
import { EditorComponent } from "@/components/Editor";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

function EditorContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  
  const { cvs } = useCVStore();
  if (!id) {
    router.push("/");
    return null;
  }

  const cv = cvs.find((c) => c.id === id);

  if (!cv) {
    router.push("/");
    return null;
  }

  return <>
  <Button
  className="cursor-pointer"
  onClick={() => router.push("/")}
  ><ArrowLeft />
  </Button>
  <EditorComponent cv={cv} />
  </>;
}

export default function GetCv() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <EditorContent />
    </Suspense>
  );
}
