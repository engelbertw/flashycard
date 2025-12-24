import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserDecks } from "@/db/queries/decks";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CreateDeckDialog } from "@/components/create-deck-dialog";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const decks = await getUserDecks(userId);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-4xl">Dashboard</CardTitle>
            <CardDescription className="text-lg">
              Welcome to your FlashyCardy dashboard
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Quick Actions</CardTitle>
            <CardDescription>Get started with your flashcards</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/decks">View All Decks</Link>
            </Button>
            <CreateDeckDialog
              trigger={<Button size="lg" variant="outline">Create New Deck</Button>}
              redirectAfterCreate={true}
            />
          </CardContent>
        </Card>

        {/* Recent Decks */}
        {decks.length > 0 ? (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-2xl">Your Decks</CardTitle>
              <CardDescription>Recently created decks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {decks.map((deck) => (
                  <Link key={deck.id} href={`/decks/${deck.id}`} className="block transition-transform hover:scale-105">
                    <Card className="h-full cursor-pointer">
                      <CardHeader>
                        <CardTitle>{deck.name}</CardTitle>
                        {deck.description && (
                          <CardDescription>{deck.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Updated: {new Date(deck.updatedAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-2xl">No Decks Yet</CardTitle>
              <CardDescription>Create your first deck to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateDeckDialog
                trigger={<Button size="lg">+ Create Your First Deck</Button>}
                redirectAfterCreate={true}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

