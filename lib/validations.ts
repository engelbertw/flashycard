import { z } from 'zod';

// Deck validation schemas
export const createDeckSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  cards: z.array(
    z.object({
      front: z.string().min(1),
      back: z.string().min(1),
    })
  ).optional(),
});

export const updateDeckSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  description: z.string().max(1000, 'Description too long').optional(),
});

export const deleteDeckSchema = z.object({
  id: z.number().positive(),
});

// Card validation schemas
export const createCardSchema = z.object({
  deckId: z.number().positive(),
  front: z.string().min(1, 'Front text is required').max(5000, 'Front text too long'),
  back: z.string().min(1, 'Back text is required').max(5000, 'Back text too long'),
}).refine(
  (data) => data.front.trim() !== data.back.trim(),
  { message: 'Front and back cannot be identical', path: ['back'] }
);

export const updateCardSchema = z.object({
  id: z.number().positive(),
  deckId: z.number().positive(),
  front: z.string().min(1, 'Front text is required').max(5000, 'Front text too long'),
  back: z.string().min(1, 'Back text is required').max(5000, 'Back text too long'),
}).refine(
  (data) => data.front.trim() !== data.back.trim(),
  { message: 'Front and back cannot be identical', path: ['back'] }
);

export const deleteCardSchema = z.object({
  id: z.number().positive(),
  deckId: z.number().positive(),
});

// Export TypeScript types from Zod schemas
export type CreateDeckInput = z.infer<typeof createDeckSchema>;
export type UpdateDeckInput = z.infer<typeof updateDeckSchema>;
export type DeleteDeckInput = z.infer<typeof deleteDeckSchema>;
export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type DeleteCardInput = z.infer<typeof deleteCardSchema>;

