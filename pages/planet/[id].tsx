import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { CustomCanvas, SaturnCanvas } from "@/components";

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
  discoverer?: string;
  satelliteOf?: string;
  surfaceArea?: string;
  wikipedia: string;
  wikiPageID: string;
}

const Planet: React.FC<PlanetProps> = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const [loading, setLoading] = useState(true);
  const [planet, setPlanet] = useState<Planet>();
  const [modelPath, setModelPath] = useState("/models/unknown/scene.gltf"); // New state variable for model path

  useEffect(() => {
    if (!id) return;
    searchPlanetById(id)
      .then((response) => {
        const planet = (response as any)?.results?.bindings[0];
        console.log(planet);
        if (planet) {
          for (const key in planet) {
            planet[key] = planet[key]?.value;
          }

          getWikipediaImage(id)
            .then((imageURL) => {
              if (planet) {
                planet.imageWikipedia = imageURL!;
              }
              setPlanet(planet);
              checkModelPath(id); // Check for model path when a planet is found
              console.log(imageURL);
            })
            .catch((error) => {
              console.log(error);
              alert("Image not found");
            });
          setLoading(false);
        } else {
          alert("Planet not found");
        }

        // setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        alert("Planet not found");
      });
  }, [id]);

  // Function to simulate checking if the model path exists
  const checkModelPath = (planetName: string) => {
    // Replace this logic with your actual check
    const knownPlanets = [
      "Mercury",
      "Venus",
      "Earth",
      "Mars",
      "Jupiter",
      "Saturn",
      "Uranus",
      "Neptune",
      "Moon",
      "Haumea",
      "Makemake",
    ]; // Example list of known planets
    const pathExists = knownPlanets.includes(planetName);
    setModelPath(
      pathExists
        ? `/models/${planetName}/scene.gltf`
        : "/models/unknown/scene.gltf"
    );
  };

  return (
    <>
      <Head>
        <title>{(id || "Loading") as ReactNode}</title>
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
            {(planet ? id : "Loading") as ReactNode}
          </h1>
        </div>
        <div className="overflow-x-hidden overflow-y-scroll text-justify">
          <div className="grid grid-cols-4 gap-x-2">
            <div className="col-span-1 flex flex-col items-left">
              {planet?.name === "Saturn" ? (
                <SaturnCanvas />
              ) : (
                <CustomCanvas modelPath={modelPath} />
              )}
              <Image
                className="mb-2 rounded-xl"
                src={planet?.imageWikipedia || planet?.image || "/logo.gif"}
                alt={id || "Loading"}
                width={300}
                height={300}
              />
              <span className="flex-grow mr-2">
                {planet?.mass && renderSubSection("Mass", planet.mass + "kg")}
                {planet?.volume && renderSubSection("Volume", planet.volume)}
                {planet?.radius && renderSubSection("Radius", planet.radius)}
                {planet?.discovered &&
                  renderSubSection("Date of discover", planet.discovered)}
                {planet?.discoverer &&
                  renderSubSection("Discoverer", planet.discoverer)}
                {planet?.meanTemperature &&
                  planet?.minTemperature &&
                  planet?.maxTemperature &&
                  renderSubSection(
                    "Temperature",
                    "Minimum : " +
                      planet.minTemperature +
                      "\nMaxmimum : " +
                      planet.maxTemperature +
                      "\nMean : " +
                      planet.meanTemperature
                  )}
                {planet?.satelliteOf &&
                  renderSubSection("Satellite of", planet.satelliteOf)}
                {planet?.surfaceArea &&
                  renderSubSection("Surface", planet.surfaceArea)}
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
