import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const practiceRouter = createTRPCRouter({
  createSession: protectedProcedure
    .input(
      z.object({
        levels: z.number().int(),
        deckId: z.number().int(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.deckPracticeSession.create({
        data: {
          deckId: input.deckId,
          levels: input.levels,
        },
      });
    }),
  get: protectedProcedure
  .input(
    z.object( { deckId: z.number().int() })
  )
  .query(
    ({  ctx, input  }) => {
      return ctx.db.deckPracticeSession.findUnique({
        where: { deckId: input.deckId }
      })
    }
  )
})
