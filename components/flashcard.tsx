'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EditCardDialog } from './edit-card-dialog';
import { DeleteCardDialog } from './delete-card-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { MoreVertical, Edit, Trash } from 'lucide-react';

interface FlashcardProps {
  card: {
    id: number;
    deckId: number;
    front: string;
    back: string;
  };
}

export function Flashcard({ card }: FlashcardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow relative">
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <EditCardDialog
              card={card}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              }
            />
            <DeleteCardDialog
              card={card}
              trigger={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardHeader className="pr-12">
        <CardTitle className="text-lg">Front</CardTitle>
        <CardDescription className="text-base font-normal text-foreground whitespace-pre-wrap">
          {card.front}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-semibold text-muted-foreground mb-1">
          Back
        </p>
        <p className="text-base whitespace-pre-wrap">{card.back}</p>
      </CardContent>
    </Card>
  );
}

