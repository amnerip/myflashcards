import { api } from "~/utils/api";
import { useRouter as useNavigate } from "next/navigation";

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
  const navigate = useNavigate()
  const trpcUtils = api.useUtils()

  const { register, handleSubmit, control } = useForm<DeckObject>({
    defaultValues: {
      cards: [{ question: "", answer: "" }]
    }
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "cards",
  });

  const { mutate, isLoading } = api.deck.create.useMutation({
    onSuccess: (data) => {
      void trpcUtils.deck.getUserDecks.invalidate()
      navigate.push(`/deck/${data.id}`)
      return
    }
  });

  const onSubmit: SubmitHandler<DeckObject> = (data) => {
    return mutate({ name: data.name, cards: data.cards })
  }

  // TODO: Popup with notice about whether it worked or not
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
                  <div key={item.id} className="flex flex-row justify-evenly py-2 gap-2">
                    <div className="flex flex-row grow justify-evenly rounded bg-slate-300 py-2 px-2">
                      <input type="text" className="flex grow bg-transparent border-r outline-none px-2" placeholder="Question" {...register(`cards.${index}.question`)} />
                      <input type="text" className="flex grow bg-transparent border-l outline-none px-2" placeholder="Answer" {...register(`cards.${index}.answer`)} />
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="bg-sky-50 px-2 rounded"
                    >
                      x
                    </button>
                  </div>
                </>
              )
            }
          )
        }
        <button
          type="button"
          onClick={() => append({ question: "", answer: "" })}
          className="bg-sky-50"
        >
          +
        </button>


        <input type="submit"
          className="rounded bg-sky-500 py-4"
          disabled={isLoading}
        />
      </form>
    </>
  )
}
