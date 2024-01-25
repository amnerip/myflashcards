import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

import { lora } from "~/styles/fonts";
export default function Navbar() {
  const { data: sessionData, status } = useSession();
  return <>
    <div className="flex flex-row w-full justify-between bg-blue-50 p-4 text-center">
      <div className="text-xl flex items-center px-2">
        <Link href={`/`} className={lora.className}>
          My Flashcards
        </Link>
      </div>
      <div className="flex flex-row justify-end items-right">
        <div className="flex items-center px-6 py-2">
          {status == "authenticated" && sessionData.user.name}
        </div>
        <AuthShowcase status={status} />
      </div>
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
