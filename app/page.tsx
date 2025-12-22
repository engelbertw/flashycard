import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AuthButtons } from "@/components/auth-buttons";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-6xl font-bold tracking-tight">
            FlashyCardy
          </CardTitle>
          <CardDescription className="text-xl">
            Your personal flashcard platform
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <AuthButtons />
        </CardContent>
      </Card>
    </div>
  );
}
