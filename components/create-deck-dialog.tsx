'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createDeckAction } from '@/actions/deck-actions';
import { generateCardsWithAI } from '@/actions/ai-actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, Cpu } from 'lucide-react';

interface CreateDeckDialogProps {
  trigger?: React.ReactNode;
  redirectAfterCreate?: boolean;
}

export function CreateDeckDialog({ trigger, redirectAfterCreate = false }: CreateDeckDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cardCount, setCardCount] = useState(20);
  const [cardsText, setCardsText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseCards = (text: string): Array<{ front: string; back: string }> => {
    if (!text.trim()) return [];
    
    const lines = text.split('\n').filter(line => line.trim());
    const cards = [];
    
    for (const line of lines) {
      // Support multiple separators: | or ; or tab
      const separators = ['|', ';', '\t'];
      let front = '';
      let back = '';
      
      for (const sep of separators) {
        if (line.includes(sep)) {
          const parts = line.split(sep).map(p => p.trim());
          if (parts.length >= 2 && parts[0] && parts[1]) {
            front = parts[0];
            back = parts[1];
            break;
          }
        }
      }
      
      if (front && back) {
        cards.push({ front, back });
      }
    }
    
    return cards;
  };

  const handleGenerateWithAI = async () => {
    setIsGenerating(true);
    setError(null);

    if (!description.trim()) {
      setError('Please enter a description to generate cards with AI');
      setIsGenerating(false);
      return;
    }

    const result = await generateCardsWithAI(description, cardCount);

    if (result.success && result.data) {
      setCardsText(result.data);
    } else {
      setError(result.error || 'Failed to generate cards');
    }

    setIsGenerating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!name.trim()) {
      setError('Deck name is required');
      setIsLoading(false);
      return;
    }

    const cards = parseCards(cardsText);
    
    if (cards.length === 0) {
      setError('Please add at least one card. Use format: Front | Back (one per line)');
      setIsLoading(false);
      return;
    }

    const result = await createDeckAction({
      name,
      description: description || undefined,
      cards,
    });

    if (result.success) {
      // Reset form
      setName('');
      setDescription('');
      setCardsText('');
      setOpen(false);
      
      // Optionally redirect to the new deck
      if (redirectAfterCreate && result.data) {
        router.push(`/decks/${result.data.id}`);
      }
    } else {
      setError(typeof result.error === 'string' ? result.error : 'Failed to create deck');
    }

    setIsLoading(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset on close
      setName('');
      setDescription('');
      setCardCount(20);
      setCardsText('');
      setError(null);
    }
  };

  const parsedCards = parseCards(cardsText);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || <Button>+ Create Deck</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Deck with Cards</DialogTitle>
          <DialogDescription>
            Let local Gemma3 AI generate cards for you, or paste your own in the format <code className="text-xs bg-muted px-1 py-0.5 rounded">Front | Back</code>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Deck Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Dutch Food Vocabulary"
              disabled={isLoading || isGenerating}
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">
              Description * <span className="text-xs text-muted-foreground">(used by AI to generate cards)</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Typical food Dutch to English, Basic Spanish greetings, Capital cities of Europe, etc."
              disabled={isLoading || isGenerating}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardCount">Number of Cards to Generate</Label>
            <Input
              id="cardCount"
              type="number"
              min={1}
              max={100}
              value={cardCount}
              onChange={(e) => setCardCount(parseInt(e.target.value) || 20)}
              disabled={isLoading || isGenerating}
              placeholder="e.g., 20"
            />
            <p className="text-xs text-muted-foreground">
              ⚡ Gemma3 270M is a fast, lightweight model. Generate cards in seconds!
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleGenerateWithAI}
              disabled={isLoading || isGenerating || !description.trim()}
              className="flex-1"
              variant="secondary"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating {cardCount} cards with Gemma3...
                </>
              ) : (
                <>
                  <Cpu className="mr-2 h-4 w-4" />
                  Generate {cardCount} Cards with Gemma3 (Local)
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            🖥️ Uses Gemma3 AI running locally on your computer (free, private, offline)
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="cards">
                Cards * <span className="text-xs text-muted-foreground">(AI-generated or paste your own)</span>
              </Label>
              {parsedCards.length > 0 && (
                <span className="text-xs text-muted-foreground font-medium">
                  {parsedCards.length} cards detected
                </span>
              )}
            </div>
            <Textarea
              id="cards"
              value={cardsText}
              onChange={(e) => setCardsText(e.target.value)}
              placeholder={isGenerating ? "AI is generating your cards..." : "Click 'Generate with AI' or paste cards manually:\nApple | Appel\nBread | Brood\nCheese | Kaas\n..."}
              disabled={isLoading || isGenerating}
              rows={16}
              className="font-mono text-sm"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>💡 Format: Front | Back (one per line)</span>
              {parsedCards.length > 0 && (
                <span className="text-green-600 dark:text-green-400 font-medium">
                  ✓ Ready to create {parsedCards.length} cards
                </span>
              )}
            </div>
          </div>

          {parsedCards.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs">Preview (first 5 cards)</Label>
              <div className="border rounded-lg p-3 space-y-2 bg-muted/30 max-h-[200px] overflow-y-auto">
                {parsedCards.slice(0, 5).map((card, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground font-mono w-6">{index + 1}.</span>
                    <span className="flex-1 font-medium">{card.front}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="flex-1">{card.back}</span>
                  </div>
                ))}
                {parsedCards.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    ... and {parsedCards.length - 5} more cards
                  </p>
                )}
              </div>
            </div>
          )}
          
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading || isGenerating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isGenerating || !name.trim() || parsedCards.length === 0}>
              {isLoading ? 'Creating...' : `Create Deck with ${parsedCards.length} Cards`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

