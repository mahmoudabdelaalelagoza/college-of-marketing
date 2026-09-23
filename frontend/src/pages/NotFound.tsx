import { useLocation } from "react-router-dom";
import Button from "@/components/base/Button";

export default function NotFound() {
  const location = useLocation();
  
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background-100 px-4 text-center">
      <h1 className="pointer-events-none absolute bottom-0 z-0 select-none font-heading text-9xl font-black text-background-200 md:text-[12rem]">
        404
      </h1>
      <div className="relative z-10">
        <h1 className="mt-6 font-heading text-2xl font-semibold text-foreground-950 md:text-3xl">
          Page not found
        </h1>
        <p className="mt-2 font-mono text-sm text-foreground-500">{location.pathname}</p>
        <p className="mx-auto mt-4 max-w-md text-base text-foreground-600">
          The page may have moved, or the address may be incorrect.
        </p>
        <Button to="/college-of-marketing" className="mt-8" arrow>
          Back to College of Marketing
        </Button>
      </div>
    </div>
  );
}

