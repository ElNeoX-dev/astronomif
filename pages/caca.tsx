import { Coustard } from "next/font/google";
import { CustomInput } from "@/components";
import { CustomButton2 } from "@/components";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

const codystar = Coustard({ weight: "400", subsets: ["latin"] });

export default function Home() {
  const [buttonImagePlanet, setButtonImagePlanet] = useState("/planet.png");
  const onMouseOutPlanet = "/planet.gif";

  const [buttonImageGalaxy, setButtonImageGalaxy] = useState("/galaxy.png");
  const onMouseOutGalaxy = "/galaxy.gif";

  const [buttonImageStars, setButtonImageStars] = useState("/stars.png");
  const onMouseOutStars = "/stars.gif";

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
          <CustomButton2
            image={buttonImagePlanet}
            onClick={async () => {}}
            onMouseOver={async () => {
              setButtonImagePlanet(onMouseOutPlanet);
            }}
            onMouseOut={async () => {
              setButtonImagePlanet("/planet.png");
            }}
          />
          <CustomButton2
            image={buttonImageGalaxy}
            onClick={async () => {}}
            onMouseOver={async () => {
              setButtonImageGalaxy(onMouseOutGalaxy);
            }}
            onMouseOut={async () => {
              setButtonImageGalaxy("/galaxy.png");
            }}
          />
          <CustomButton2
            image={buttonImageStars}
            onClick={async () => {}}
            onMouseOver={async () => {
              setButtonImageStars(onMouseOutStars);
            }}
            onMouseOut={async () => {
              setButtonImageStars("/stars.png");
            }}
          />
        </div>
      </div>
    </>
  );
}
