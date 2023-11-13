import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

import { searchPlanetById } from "@/utils";
import Link from "next/link";

interface PlanetProps {}

interface Planet {
  name?: string;
  description?: string;
  image?: string;
  distance?: string;
  mass?: string;
}

const Planet: React.FC<PlanetProps> = () => {
  const router = useRouter();

  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [planet, setPlanet] = useState<Planet>();

  useEffect(() => {
    if (!id) return;
    searchPlanetById(id as string)
      .then((response) => {
        const planet = (response as any)?.results?.bindings[0];
        console.log(planet);
        if (planet) {
          for (const key in planet) {
            planet[key] = planet[key]?.value;
          }
          setPlanet(planet);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        alert("Planet not found");
      });
  }, [id]);

  return (
    <>
      <Head>
        <title>{(planet ? planet.name : "Loading") as ReactNode}</title>
      </Head>
      <div className="flex flex-col flex-grow gap-4">
        <div className="flex flex-row justify-start">
          <Link href="/">
            <Image
              className=""
              src="/logo.gif"
              alt="Astronom'IF"
              width={100}
              height={100}
            />
          </Link>
          <h1 className="title mb-15">
            {(planet ? planet.name : "Loading") as ReactNode}
          </h1>
        </div>
        <div className="grid grid-cols-4 gap-x-2 overflow-scroll">
          <div className="col-span-1 flex flex-col items-center">
            <Image
              src={planet?.image ? planet.image : "/logo.gif"}
              alt={planet?.name ? planet.name : "Loading"}
              width={300}
              height={300}
            />
            <span></span>
          </div>
          <div className="col-span-3">
            <span>{planet?.description}</span>
            <span>{planet?.description}</span>
            <span>{planet?.description}</span>
            <span>{planet?.description}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Planet;
