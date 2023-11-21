import type { Metadata } from "next";
import Head from "next/head";
import { Cabin } from "next/font/google";
import "@/app/globals.css";
import "@/app/loading.css";

import { MouseEffect } from "@/components";

const cabin = Cabin({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AstronomIF",
  description:
    "The first astronomy search engine, made by students for students.",
};

interface LayoutProps {
  Component: React.FC;
  pageProps: any;
}

const RootLayout: React.FC<LayoutProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/icon.svg" />
        <title>Astronom&apos;IF</title>
      </Head>
      <MouseEffect />
      <div className="min-h-screen max-h-screen overflow-hidden flex">
        <div id="background" />
        <div className="m-6 glassBackground rounded-tl-[30px] rounded-br-[30px] flex-grow overflow-hidden">
          <main
            className={`${cabin.className} text-white flex w-full h-full flex-col items-center`}
          >
            <Component {...pageProps} />
          </main>
        </div>
      </div>
    </>
  );
};

export default RootLayout;
