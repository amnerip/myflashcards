import { useSession } from "next-auth/react";

import { api } from "~/utils/api";

export default function Home() {
  const { status } = useSession();
  return (
    <>
      <div className="flex flex-col w-screen h-screen justify-start">
        <div id="body" className="flex justify-center w-full">
          {
            status == "authenticated" ?
              <div>
                <DecksList />
              </div>
              : <div />
          }
        </div>
      </div>
    </>
  );
}

function DecksList() {
  const { data: decks, isLoading } = api.deck.getAllDecks.useQuery();
  if (!decks || isLoading) return <div>Loading...</div>

  const items = decks.map((d) => ({ id: d.id, name: d.name }))

  return (
    <div className="flex flex-col justify-center md:max-w-2xl gap-2 px-8 py-4">
      <span className="text-xl">Decks</span>
      {items.map(
        (deck) => (
          <div key={deck.id} className="px-4 py-2 rounded-sm bg-slate-300 hover:bg-slate-200">{deck.name}</div>
        )
      )}
    </div>
  )
}

