import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="space-y-6 max-w-md w-full">
        {/* Icon with subtle animation */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <FileQuestion className="w-24 h-24 text-primary relative z-10" />
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
            Page not found
          </h1>
          <p className="text-muted-foreground">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">
              Go back home
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[100px]" />
      </div>
    </div>
  );
}
