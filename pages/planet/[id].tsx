import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

import { searchPlanetById, getWikipediaImage, renderSection } from "@/utils";
import Link from "next/link";
import { renderSubSection } from "@/utils/utils";

interface PlanetProps {}

interface Planet {
  name: string;
  description?: string;
  image?: string;
  imageWikipedia?: string;
  volume?: string;
  mass?: string;
  gravity?: string;
  radius?: string;
  meanTemperature?: string;
  minTemperature?: string;
  maxTemperature?: string;
  discovered?: string;
  satelliteOf?: string;
  surfaceArea?: string;
  wikipedia: string;
  wikiPageID: string;
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

        // setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        alert("Planet not found");
      });

      getWikipediaImage(id as string)
      .then((imageURL) => {
        if (planet) {
          planet.imageWikipedia = imageURL!;
          setPlanet(planet);
        }
        console.log(imageURL);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        alert("Image not found");
      });
        
      
  }, [id]);

  return (
    <>
      <Head>
        <title>{(planet ? planet.name : "Loading") as ReactNode}</title>
      </Head>
      <div className="flex flex-col gap-2 py-2 px-4 overflow-y-scroll">
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
            {(planet?.name || "Loading") as ReactNode}
          </h1>
        </div>
        <div className="overflow-x-hidden overflow-y-scroll text-justify">
          <div className="grid grid-cols-4 gap-x-2">
            <div className="col-span-1 flex flex-col items-left">
              <Image className="mb-2"
                src={planet?.imageWikipedia || planet?.image || "/logo.gif"}
                alt={planet?.name || "Loading"}
                width={300}
                height={300}
              />
                
              <span className="flex-grow mr-2">
                {planet?.mass && renderSubSection("Mass", planet.mass)}
                {planet?.volume && renderSubSection("Volume", planet.volume)}
                {planet?.radius && renderSubSection("Radius", planet.radius)}
                {planet?.discovered && renderSubSection("Date of discover", planet.discovered)}
                {(planet?.meanTemperature && planet?.minTemperature && planet?.maxTemperature ) && renderSubSection("Temperature", "Minimum : " + planet.minTemperature +"\nMaxmimum : " + planet.maxTemperature + "\nMean : " + planet.meanTemperature )}
                {planet?.satelliteOf && renderSubSection("Satellite of", planet.satelliteOf)}
                {planet?.surfaceArea && renderSubSection("Surface", planet.surfaceArea)}
              </span>
            </div>
            <div className="col-span-3">
              {planet?.description &&
                renderSection("Description", planet.description)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Planet;
