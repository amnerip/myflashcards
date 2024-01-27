import { useRouter } from "next/router"
import LoadingSpinner from "~/components/loading";
import { api } from "~/utils/api";
import ErrorPage from "next/error"
import { useRouter as useNavigate } from "next/navigation";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";

type UpdateFields = {
  deckId: number
  cards: {
    question: string
    answer: string
  }[]
}

export default function DeckViewPage() {
  const router = useRouter();
  const navigate = useNavigate()
  const trpcUtils = api.useUtils()
  const { id, addCards } = router.query as { id: string, addCards: string }

  const { data: deck, isLoading: deckLoading } = api.deck.getFullDeck.useQuery(
    { id: parseInt(id) },
    { enabled: router.isReady }
  );
  const { mutate: deleteDeck } = api.deck.delete.useMutation({
    onSuccess: () => { navigate.push('/') }
  });
  const { mutate: editMutation } = api.deck.createCards.useMutation({
    onSuccess: (_data, variables) => { 
      void trpcUtils.deck.getFullDeck.invalidate({ id: variables.deckId });
      navigate.push(`/deck/${id}`) 
    }
  })
  const { register, handleSubmit, reset, setValue, control } = useForm<UpdateFields>({ defaultValues: { cards: [{ question: "", answer: "" }] } });
  const { fields, prepend, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "cards", // unique name for your Field Array
  });

  if (deckLoading || !router.isReady) return <div className="flex h-screen justify-center"> <LoadingSpinner /> </div>

  if (!deck) return <ErrorPage statusCode={404} />
  setValue('deckId', deck.id)

  const onSubmit: SubmitHandler<UpdateFields> = (data) => {
    console.log(data)
    editMutation(data)
  }

  return (
    <>
      <div className="flex flex-col">
        <h2 className="text-4xl font-extrabold dark:text-white p-4">
          {deck.name}
        </h2>

        <div className="flex flex-row items-center justify-between px-4">
          <h3 className="text-2xl font-bold dark:text-white">
            In this set ({deck.cards.length})
          </h3>
          <div className="flex gap-2 text-xs">
            {
              !addCards &&
              <>
                <button
                  className="px-4 py-3 bg-sky-500 rounded-md" onClick={() => { navigate.push(`/deck/${deck.id}?addCards=1`) }}> Add Card </button>
                <button
                  type="button" className="px-4 py-3 bg-red-500 rounded-md" onClick={() => { deleteDeck({ id: deck.id }) }} > Delete </button>
              </>
            }
          </div>
        </div>

        <div className="flex flex-col p-4">

          {
            addCards &&
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-row justify-evenly gap-4 text-center">
                <input type="submit" className="flex grow bg-green-500 rounded-md px-4" />
                <button className="flex grow px-4 py-2 bg-red-500 rounded-md" onClick={() => {
                  reset()
                  return navigate.push(`/deck/${deck.id}`)
                }}>Cancel</button>
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
                          {
                            index != 0 &&
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="bg-sky-50 px-2 rounded"
                            >
                              x
                            </button>
                          }
                          {
                            index == 0 &&
                            <button
                              type="button"
                              onClick={() => prepend({ question: "", answer: "" })}
                              className="bg-sky-50 px-2 rounded"
                            >
                              +
                            </button>
                          }
                        </div>
                      </>
                    );
                  }
                )
              }

              {
                deck.cards.map((c) => {
                  return <div key={c.id} className="flex flex-row justify-around p py-4 rounded bg-slate-100">
                    <span className="flex grow border-r px-4"> {c.question} </span>
                    <span className="flex grow border-l px-4"> {c.answer} </span>
                  </div>
                })
              }
            </form>
          }
          {
            !addCards &&
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
  )

}
