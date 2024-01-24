import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const deckRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object(
        {
          name: z.string().min(1).max(255),
          cards: z.object(
            {
              question: z.string(), answer: z.string()
            }
          ).array()
        }
      )
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.deck.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
          cards: {
            create: input.cards
          }
        },
      });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.deck.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  getFullDeck: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .query(({ ctx, input }) => {
      return ctx.db.deck.findUnique({
        where: { id: input.id },
        include: { cards: true }
      })
    }),

  getUserDecks: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.deck.findMany(
        {
          select: { name: true, id: true },
          where: { createdById: ctx.session.user.id },
        }
      );
    }),
});
