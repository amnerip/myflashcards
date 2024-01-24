import { useSession } from "next-auth/react";
import Link from "next/link";
import LoadingSpinner from "~/components/loading";
import { api } from "~/utils/api";

export default function Home() {
  const { status } = useSession();
  return (
    <>
      <div className="flex flex-col w-screen h-screen justify-start">
        <div className="flex justify-center items-center w-full">
          {
            status == "authenticated" ?
              <>
                <DecksList />
              </>
              : <div />
          }
        </div>
      </div>
    </>
  );
}

function DecksList() {
  const { data: decks, isLoading } = api.deck.getUserDecks.useQuery();

  if (isLoading) return <div className="p-16"><LoadingSpinner /></div>

  if (!decks) return <div>404</div>


  return (
    <div className="flex flex-col justify-center md:max-w-2xl gap-2 px-8 py-4">
      <div className="flex flex-row justify-between">
        { decks.length != 0 && <span className="text-xl px-4 items-center flex">Decks</span> }
        <Link href={`/deck/create`} className="px-4 py-2 bg-sky-500 rounded"> Create Deck </Link>
      </div>
      {decks.map(
        (deck) => (
          <Link
            key={deck.id}
            href={`/deck/${deck.id}`}
            className="px-4 py-2 rounded-sm bg-slate-300 hover:bg-slate-200"
          >
            {deck.name}
          </Link>
        )
      )}
    </div>
  )
}

