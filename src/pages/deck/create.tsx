import { api } from "~/utils/api";

import { useForm, useFieldArray, SubmitHandler } from "react-hook-form"

export default function CreateDeckPage() {
  return (
    <div className="flex flex-col p-4 gap-4">
      <CreateDeck />
    </div>
  )
}

type DeckObject = {
  name: string
  cards: {
    question: string
    answer: string
  }[]
}

function CreateDeck() {
  // TODO: add ability to grow the number of cards in the deck.
  const { register, handleSubmit, control } = useForm<DeckObject>({
    defaultValues: {
      cards: [{ question: "", answer: "" }]
    }
  });
  const { fields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "cards", // unique name for your Field Array
  });

  const { mutate, isLoading } = api.deck.create.useMutation({
    onSuccess: () => {
      // TODO: clear form inputs
      return
    }
  });

  const onSubmit: SubmitHandler<DeckObject> = (data) => {
    return mutate({ name: data.name, cards: data.cards })
  }

  // TODO: Popup with notice about whether it worked or not, provide link to deck view page.
  // TODO: clear form inputs when succesfully submitted
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex flex-col bg-slate-300 rounded gap-1 px-4 py-2">
          <label htmlFor="deck-name" className="text-xs/none"> Deck Name </label>
          <input
            type="text"
            id="deck-name"
            className="grow outline-none bg-transparent w-full border-red-700"
            placeholder="Enter the deck's title"
            maxLength={255}
            disabled={isLoading}
            {...register("name")}
          />
        </div>

        {
          fields.map(
            (item, index) => {
              return (
                <>
                  <div key={item.id} className="flex flex-row justify-evenly bg-slate-300 px-2 py-2">
                    <input type="text" className="flex grow bg-transparent border-r outline-none px-2" placeholder="Question" {...register(`cards.${index}.question`)} />
                    <input type="text" className="flex grow bg-transparent border-l outline-none px-2" placeholder="Answer" {...register(`cards.${index}.answer`)} />
                  </div>
                </>
              )
            }
          )
        }

        <input type="submit"
          className="rounded bg-sky-500 py-4"
          disabled={isLoading}
        />
      </form>
    </>
  )
}
