import { Suspense } from "react";
import { PathFinder } from "@/components/PathFinder";

export default function PathPage() {
  return (
    <Suspense fallback={null}>
      <PathFinder />
    </Suspense>
  );
}
