import { api } from "~/utils/api";
import { useState } from "react";

export default function CreateDeckPage() {
  return <>
    <CreateDeck/>
  </>
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
