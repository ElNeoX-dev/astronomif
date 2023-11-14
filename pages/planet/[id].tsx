import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { CustomCanvas, SaturnCanvas } from "@/components";

import { searchPlanetById, renderSection } from "@/utils";
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
  const [modelPath, setModelPath] = useState("/models/unknown/scene.gltf"); // New state variable for model path

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
          checkModelPath(id); // Check for model path when a planet is found
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        alert("Planet not found");
      });
  }, [id]);

  // Function to simulate checking if the model path exists
  const checkModelPath = (planetName) => {
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
      "Makemake"
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
            {(planet ? id : "Loading") as ReactNode}
          </h1>
        </div>
        <div className="overflow-x-hidden overflow-y-scroll text-justify">
          <div className="grid grid-cols-4 gap-x-2">
            <div className="col-span-1 flex flex-col items-center">
              {planet?.name === "Saturn" ? (
                <SaturnCanvas/>
              ) : (
                <CustomCanvas modelPath={modelPath} />
              )}
              <span></span>
            </div>
            <div className="col-span-1 flex flex-col items-center">
              <Image
                src={planet?.image ? planet.image : "/logo.gif"}
                alt={planet?.name ? planet.name : "Loading"}
                width={300}
                height={300}
              />
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
