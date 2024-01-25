import { useRouter } from "next/router"
import LoadingSpinner from "~/components/loading";
import { api } from "~/utils/api";

export default function DeckView() {
  const router = useRouter();
  const deckId = router.query.id as string;

  if (!deckId) return <div></div>

  const { data: deck, isLoading } = api.deck.getFullDeck.useQuery({ id: parseInt(deckId) });
  if (isLoading) return <LoadingSpinner />

  if (!deck) return <div>404</div>

  return <>
    <div className="flex flex-col">
      <h2 className="text-4xl font-extrabold dark:text-white p-4">
        {deck.name}
      </h2>

      <h3 className="text-2xl font-bold dark:text-white p-4">
        In this set ({deck.cards.length})
      </h3>

      <div className="flex flex-col p-4">
        {
          deck.cards.map((c) => {
            return <div key={c.id} className="flex flex-row justify-around p py-4 rounded bg-slate-100">
              <span className="flex grow border-r px-4"> {c.question} </span>
              <span className="flex grow border-l px-4"> {c.answer} </span>
            </div>
          })
        }
      </div>
    </div>
  </>
}
