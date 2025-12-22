import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl">Dashboard</CardTitle>
            <CardDescription className="text-lg">
              Welcome to your FlashyCardy dashboard
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

