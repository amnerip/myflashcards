import { deckRouter } from "~/server/api/routers/deck";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  deck: deckRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
