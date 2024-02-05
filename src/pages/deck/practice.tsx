import { useRouter } from "next/router"
import LoadingSpinner from "~/components/loading"
import { useForm, SubmitHandler } from "react-hook-form"
import { api } from "~/utils/api"
import { useRouter as useNavigate } from "next/navigation";
import { Prisma } from '@prisma/client';


type PracticeSessionForm = {
  levels: number
}

const deckPracticeSessionWithCards = Prisma.validator<Prisma.DeckPracticeSessionDefaultArgs>()({
  include: { cards: true }
})

type DeckPracticeSessionWithCards = Prisma.DeckPracticeSessionGetPayload<typeof deckPracticeSessionWithCards>;


export default function PracticeDeck() {
  const router = useRouter()
  const deckId = parseInt(router.query.id as string)

  const { data, isLoading: sessionLoading } = api.practice.get.useQuery(
    { deckId: deckId },
    { enabled: router.isReady }
  );

  if (!router.isReady || sessionLoading) return <LoadingSpinner />

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
   */

  // for every level in the session we query for cards
  // that are at or have passed the practice threshold
  // - show the oldest levels firsta


  if (!data)
    return <CreatePracticeSessionForm deckId={deckId} />
  else
    return <RunPracticeSession session={data} />
}

function RunPracticeSession(props: { session: DeckPracticeSessionWithCards }) {
  // show question, one by one, have two buttons. one for remembered, another for forgot
  // we order cards by their id in ascending order, track the largest id reviewed, for each card that's reviewed we make a card practice status
  // after we wento ver the pending cards without status we look at all the cards that have a status, we only want to review the ones that are due.
  // so for each level we have a function for if it's due to review. if as of today we're past the defined interval.
  //
  return (
    <>
    </>
  )
}

function CreatePracticeSessionForm(props: { deckId: number }) {
  const defaultLevel = 4
  const { deckId } = props

  const trpcUtils = api.useUtils()
  const navigate = useNavigate()
  const { mutate, isLoading } = api.practice.createSession.useMutation()
  const { register, handleSubmit, watch } = useForm<PracticeSessionForm>({ defaultValues: { levels: defaultLevel } });
  const onSubmit: SubmitHandler<PracticeSessionForm> = (data) => {
    void trpcUtils.practice.get.invalidate()
    mutate({ deckId: deckId, levels: data.levels })
    navigate.refresh()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div className="flex flex-col">
        <div className="flex flex-row ">
          <input type="range" min="2" max="7" id="level-range" defaultValue={defaultLevel} {...register("levels")} />
          <label className="px-2"> Use {watch("levels")} buckets to learn</label>
        </div>

        <input type="submit"
          className="rounded bg-sky-500 py-4"
          disabled={isLoading}
        />

      </div>
    </form>
  )
}
