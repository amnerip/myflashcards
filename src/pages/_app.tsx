import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "~/components/navbar";
import Head from "next/head";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Analytics />
      <Head>
        <title>MyFlashcards</title>
        <meta name="description" content="Simple flashcards app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
};

export { useReportWebVitals } from 'next-axiom';
export default api.withTRPC(MyApp);
