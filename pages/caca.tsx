import { Coustard } from "next/font/google";
import { CustomInput } from "@/components";
import { CustomButton } from "@/components";
import Head from "next/head";

const codystar = Coustard({ weight: "400", subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Astronom'IF</title>
      </Head>
      <div className="flex flex-col">
        <h1 className={`${codystar.className} title mb-15`}>Astronom'IF</h1>
        <h2 className="font-thin opacity-50 text-center unselectable">
          The first dedicated astronomy's search engine
        </h2>
        <CustomInput onChange={async () => {}} />
        <div className="flex flex-row self-center">
          <CustomButton image="/planet.gif" onClick={async () => {}} />
          <CustomButton image="/galaxy.gif" onClick={async () => {}} />
          <CustomButton image="/stars.gif" onClick={async () => {}} />
        </div>
      </div>
    </>
  );
}
