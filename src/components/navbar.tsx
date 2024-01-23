import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: sessionData, status } = useSession();
  return <>
    <div className="flex flex-row justify-end items-right w-full bg-blue-50 p-4">
      <div className="px-6 py-2">
        {status == "authenticated" && sessionData.user.name}
      </div>
      <AuthShowcase status={status} />
    </div>
  </>
}

function AuthShowcase(props: { status: string }) {
  return (
    <button
      className="rounded-xl bg-slate-300 px-6 py-2 font-semibold text-black no-underline transition hover:bg-slate-600 hover:text-white"
      onClick={props.status == "authenticated" ? () => void signOut() : () => void signIn()}
    >
      {props.status == "authenticated" ? "Sign out" : "Sign in"}
    </button>
  );
}
