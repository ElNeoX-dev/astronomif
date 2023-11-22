"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { CustomCanvas, SaturnCanvas } from "@/components";

import {
  searchPlanetByIdWiki,
  searchPlanetByNameDBP,
  getWikipediaImage,
  getType,
} from "@/utils";
import Link from "next/link";
import {
  renderSubSection,
  renderSubSectionParent,
  renderSection,
} from "@/utils/utils";

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
  albedo?: string;
  density?: string;
  distanceFromEarth?: string;
  meanTemperatureValue?: string;
  numberOfNaturalSatellites?: string;
  orbitalPeriod?: string;
  parentAstronomicalBody?: string;
  parentAstronomicalBodyLabel?: string;
  rotationalPeriod?: string;
  typeParent?: string;
}

const Planet: React.FC<PlanetProps> = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const [loading, setLoading] = useState(true);
  const [planet, setPlanet] = useState<Planet>();
  const [modelPath, setModelPath] = useState("/models/unknown/scene.gltf"); // New state variable for model path

  const handleParent = () => {
    const parent = planet!.parentAstronomicalBody!.split("/").at(-1);
    if (planet!.typeParent) {
      return renderSubSectionParent(
        "Parent",
        planet!.parentAstronomicalBodyLabel!,
        `/${planet!.typeParent}/${parent}`
      );
    } else {
      return renderSubSection("Parent", planet!.parentAstronomicalBodyLabel!);
    }
  };

  useEffect(() => {
    (async function fetchData() {
      if (!id) return;
      try {
        const responseWikidata = await searchPlanetByIdWiki(id);
        const planetWiki = responseWikidata.at(0);
        if (planetWiki) {
          for (const key in planetWiki) {
            planetWiki[key] = planetWiki[key]?.value;
          }

          const responseDBP = await searchPlanetByNameDBP(planetWiki.name);
          const planetDBP = responseDBP.at(0);

          if (planetDBP) {
            for (const key in planetDBP) {
              planetDBP[key] = planetDBP[key]?.value;
            }
          }

          const mergedPlanet = {
            ...planetDBP,
            ...planetWiki,
          };

          setPlanet(mergedPlanet);

          try {
            const imageURL = await getWikipediaImage(id as string);
            mergedPlanet.imageWikipedia = imageURL;
          } catch (error) {
            console.log(error);
          }
          const type = await getType(
            planetWiki?.parentAstronomicalBody?.split("/").at(-1)!
          );
          mergedPlanet.typeParent = type;

          setPlanet(mergedPlanet);

          checkModelPath(mergedPlanet.name);
        } else {
          alert("Planet not found");
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    })();
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
        <title>{(planet ? planet.name : "Loading") as ReactNode}</title>
      </Head>
      <div className="flex flex-col gap-2 py-2 px-4 overflow-y-scroll">
        <div className="flex flex-row justify-start">
          <Link href="/">
            <Image
              className="unselectable"
              src="/logo.gif"
              alt="Astronom'IF"
              width={100}
              height={100}
              priority
            />
          </Link>
          <h1 className="title mb-15">
            {(planet ? planet.name : "Loading") as ReactNode}
          </h1>
        </div>
        <div className="overflow-x-hidden overflow-y-scroll text-justify">
          <div className="grid grid-cols-4 gap-x-2">
            <div className="col-span-1 flex flex-col items-left">
              {planet?.name === "Saturn" ? (
                <div className="object-3d">
                  <SaturnCanvas />
                </div>
              ) : (
                <div className="object-3d">
                  <CustomCanvas modelPath={modelPath} />
                </div>
              )}
              <Image
                className="mb-2 rounded-xl unselectable"
                src={planet?.imageWikipedia || planet?.image || "/logo.gif"}
                alt={id || "Loading"}
                width={300}
                height={300}
                priority
              />
              <span className="flex-grow mr-2">
                {planet?.mass &&
                  renderSubSection("Mass", planet.mass + "e14 kg")}
                {planet?.volume &&
                  renderSubSection("Volume", planet.volume + "e14 km³")}
                {planet?.radius &&
                  renderSubSection("Radius", planet.radius + " km")}
                {planet?.meanTemperature &&
                  planet?.minTemperature &&
                  planet?.maxTemperature &&
                  renderSubSection(
                    "Temperature",
                    "Minimum: " + planet.minTemperature + " K",
                    "Maximum: " + planet.maxTemperature + " K",
                    "Mean: " + planet.meanTemperature + " K"
                  )}
                {planet?.meanTemperatureValue &&
                  renderSubSection(
                    "Mean temperature",
                    planet.meanTemperatureValue + " °C"
                  )}

                {planet?.density &&
                  renderSubSection("Density", planet.density + " g/cm³")}
                {planet?.gravity &&
                  renderSubSection("Gravity", planet.gravity + " m/s²")}
                {planet?.satelliteOf &&
                  renderSubSection("Satellite of", planet.satelliteOf)}
                {planet?.surfaceArea &&
                  renderSubSection("Surface", planet.surfaceArea + " km²")}
                {planet?.distanceFromEarth &&
                  renderSubSection(
                    "Distance from Earth",
                    planet.distanceFromEarth + " km"
                  )}
                {planet?.parentAstronomicalBodyLabel &&
                  planet?.parentAstronomicalBody &&
                  planet?.typeParent !== "" &&
                  handleParent()}
                {planet?.numberOfNaturalSatellites &&
                  renderSubSection(
                    "Number of natural satellites",
                    planet.numberOfNaturalSatellites
                  )}
              </span>
            </div>
            <div className="col-span-3 pr-3">
              {planet?.description &&
                renderSection("Description", planet.description)}
                {planet?.discovered &&
                  renderSubSection("Date of discovery", planet.discovered)}
                {planet?.discoverer &&
                  renderSubSection("Discoverer", planet.discoverer)}
                {planet?.rotationalPeriod &&
                  renderSubSection(
                    "Rotational Period",
                    planet.rotationalPeriod + " days"
                  )}
                {planet?.orbitalPeriod &&
                  renderSubSection(
                    "Orbital period",
                    planet.orbitalPeriod + " days"
                  )}
                {planet?.albedo &&
                  renderSubSection("Albedo", planet.albedo + "%")}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Planet;
