import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";

import { api } from "~/utils/api";
import { useState } from "react";

export default function Home() {
  const { status } = useSession();
  return (
    <>
      <Head>
        <title>MyFlashcards</title>
        <meta name="description" content="Simple flashcards app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="flex flex-col w-screen h-screen justify-start">
          <Header />
          <div id="body" className="flex justify-center w-full">
          {
            status == "authenticated" ? 
              <div>
                <DecksList /> 
                <CreateDeck />
              </div> 
              :  <div/>
          }
          </div>
        </div>
      </main>
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

function Header() {
  const { data: sessionData, status } = useSession();
  return <>
    <div className="flex flex-row justify-end items-right w-full bg-blue-50 p-4">
      <div className="px-6 py-2">
        {status == "authenticated" && sessionData.user?.name}
      </div>
      <AuthShowcase status={status} />
    </div>
  </>
}

function AuthShowcase(props: { status: string }) {
  return (
    <div className="">
      <button
        className="rounded-xl bg-slate-300 px-6 py-2 font-semibold text-black no-underline transition hover:bg-slate-600 hover:text-white"
        onClick={props.status == "authenticated" ? () => void signOut() : () => void signIn()}
      >
        {props.status == "authenticated" ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}

function CreateDeck() {
  const [deckName, setDeckName] = useState("");

  const deckCreateMutation = api.deck.createDeck.useMutation({
    onSuccess: () => {
      setDeckName("");
    }
  });

  return (
    <div className="flex flex-col p-4 gap-4">
      <div className="flex flex-col bg-slate-300 rounded gap-1 px-4 py-2">
        <label htmlFor="deck-name" className="text-xs/none"> Deck Name </label>
        <input
          type="text"
          id="deck-name"
          className="grow outline-none bg-transparent w-full border-red-700"
          placeholder="Enter the deck's title"
          maxLength={255}
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
          disabled={deckCreateMutation.isLoading}
        />
      </div>

      <button
        className="rounded bg-sky-500 py-4"
        onClick={() => {
          return deckCreateMutation.mutate({ name: deckName })
        }}
        disabled={deckCreateMutation.isLoading}
      >
        Create
      </button>
    </div>
  )
}
