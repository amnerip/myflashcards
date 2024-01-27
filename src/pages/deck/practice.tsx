import { useRouter } from "next/router"
import LoadingSpinner from "~/components/loading"

export default function PracticeDeck() {
  const router = useRouter()
  if (!router.isReady) return <LoadingSpinner />

  const deckId = parseInt(router.query.id)
  /**
   * the algorithm for practiciing flashcards:
   * https://fluent-forever.com/wp-content/uploads/2014/05/LeitnerSchedule.pdf
   * 64 day repeating schedule
   * Levels 1-7:
   * 1: every day
   * 2: every other day
   * 3: every 4th day
   * 4: every 8 days
   * 5: every 16 days
   * 6: every 32 days
   * 7: every 64 days
   *
   * PracticeSession:
   * - deckid
   * - number of levels
   * - start_date: to calculate where in the schedule we're in
   *
   * CardLearningStatus:
   * - cardId
   * - currentLevel
   *   @index on level to quickly query the set
   */

}
