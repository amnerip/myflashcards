import { useRouter } from "next/router"
import LoadingSpinner from "~/components/loading";
import { api } from "~/utils/api";

export default function DeckView() {
  const router = useRouter();
  const deckId = router.query.id as string;
  console.log('deck view start');

  if (!deckId) return <div></div>

  const {data: deck, isLoading} = api.deck.getDeck.useQuery({ id: parseInt(deckId)});
  if (isLoading) return <LoadingSpinner />

  if (!deck) return <div>404</div>

  return <>
    <div className="flex flex-col">
      <h2 className="text-4xl font-extrabold dark:text-white">
        {deck.name}
      </h2>
    </div>
  </>
}
