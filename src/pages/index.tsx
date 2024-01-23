import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";

import { api } from "~/utils/api";

export default function Home() {
  const { data: decks } = api.deck.getAllDecks.useQuery();
  // TODO: check for query completion, render some loading state until completion.
  if (!decks) return <div/>

  return (
    <>
      <Head>
        <title>MyFlashcards</title>
        <meta name="description" content="Simple flashcards app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex justify-center">
        <div>
          <Header />
          <DecksList items={decks.map((d) => ({id: d.id, name: d.name}))} />
        </div>
      </main>
    </>
  );
}

function DecksList(props: { items: { id: number, name: string }[] }) {
  return (
    <div className="flex flex-row md:max-w-2xl gap-4 px-8 py-4">
      {props.items.map(
        (deck) => (
          <div key={deck.id} className="px-28 py-14 rounded-xl bg-slate-300 hover:bg-slate-200">{deck.name}</div>
        )
      )}
    </div>
  )
}

function Header() {
  const { data: sessionData } = useSession();
  // TODO: check for query completion, render some loading state until completion.
  return <>
    <div className="flex flex-row justify-end items-right w-screen bg-blue-50 p-4">
      <div className="px-6 py-2">
        {sessionData?.user?.name}
      </div>
      <AuthShowcase />
    </div>
  </>
}

function AuthShowcase() {
  const { data: sessionData } = useSession();
  // TODO: check for query completion, render some loading state until completion.
  return (
    <div className="">
      <button
        className="rounded-xl bg-slate-300 px-6 py-2 font-semibold text-black no-underline transition hover:bg-slate-600 hover:text-white"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
