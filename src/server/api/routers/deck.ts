import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const deckRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  createDeck: protectedProcedure
    .input(z.object({name: z.string().min(1).max(255)}))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.deck.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.deck.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  // TODO: This returns all the decks in the db, write a query just for the
  // logged-in user.
  getAllDecks: publicProcedure.query(( { ctx }) => {
    return ctx.db.deck.findMany()
  }),
});
