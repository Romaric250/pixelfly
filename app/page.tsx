import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-10">
      <h1 className="text-3xl font-semibold">Home</h1>
      <p>
        This is the home page. You can edit it at{" "}
        <code className="p-1 bg-muted text-muted-foreground rounded-md">
          app/page.tsx
        </code>
        .
      </p>
      <Link className={buttonVariants({ variant: "outline" })} href="/docs">
        View docs
      </Link>
    </div>
  );
}
