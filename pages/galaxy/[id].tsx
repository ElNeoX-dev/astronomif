"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CustomCanvas, SaturnCanvas } from "@/components";

import { searchGalaxyById, getWikipediaImage, renderSection } from "@/utils";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { renderSubSection } from "@/utils/utils";

interface GalaxyProps {}

interface Galaxy {
  name?: string;
  type?: string;
  distance?: string;
  mass?: string;
  description?: string;
}

const Galaxy: React.FC<GalaxyProps> = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const [loading, setLoading] = useState(true);
  const [galaxy, setGalaxy] = useState<Galaxy>();
  const [modelPath, setModelPath] = useState(
    "/models/unknown_galaxy/scene.gltf"
  ); // New state variable for model path

  useEffect(() => {
    if (!id) return;
    searchGalaxyById(id)
      .then((response) => {
        const galaxy = (response as any)?.results?.bindings[0];
        console.log(galaxy);
        if (galaxy) {
          for (const key in galaxy) {
            galaxy[key] = galaxy[key]?.value;
          }

          getWikipediaImage(id)
            .then((imageURL) => {
              if (galaxy) {
                galaxy.imageWikipedia = imageURL!;
              }
              setGalaxy(galaxy);
              checkModelPath(id); // Check for model path when a galaxy is found
              console.log(imageURL);
            })
            .catch((error) => {
              console.log(error);
              alert("Image not found");
            });
          setLoading(false);
        } else {
          alert("Galaxy not found");
        }

        // setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        alert("Galaxy not found");
      });
  }, [id]);

  // Function to simulate checking if the model path exists
  const checkModelPath = (galaxyName: string) => {
    // Replace this logic with your actual check
    const knownGalaxys = ["Milky_Way"]; // Example list of known galaxys
    const pathExists = knownGalaxys.includes(galaxyName);
    setModelPath(
      pathExists
        ? `/models/${galaxyName}/scene.gltf`
        : "/models/unknown/scene.gltf"
    );
  };

  return (
    <>
      <Head>
        <title>{(id ? id.replace(/_/g, " ") : "Loading") as ReactNode}</title>
      </Head>
      <div className="flex flex-col flex-grow overflow-x-hidden overflow-y-auto">
        <div className="flex flex-row justify-galaxyt">
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
            {(id ? id.replace(/_/g, " ") : "Loading") as ReactNode}
          </h1>
        </div>
        <div className="overflow-x-hidden overflow-y-scroll text-justify">
          <div className="grid grid-cols-4 gap-x-2">
            <div className="col-span-1 flex flex-col items-left">
              <div className="object-3d">
                <CustomCanvas modelPath={modelPath} type="galaxy" />
              </div>
              <Image
                className="mb-2 rounded-xl"
                src={galaxy?.imageWikipedia || galaxy?.image || "/logo.gif"}
                alt={galaxy?.name || "Loading"}
                width={300}
                height={300}
              />
              <span className="flex-grow mr-2">
                {galaxy?.mass && renderSubSection("Mass", galaxy.mass + "kg")}
                {galaxy?.volume && renderSubSection("Volume", galaxy.volume)}
                {galaxy?.radius && renderSubSection("Radius", galaxy.radius)}
                {galaxy?.discovered &&
                  renderSubSection("Date of discover", galaxy.discovered)}
                {galaxy?.discoverer &&
                  renderSubSection("Discoverer", galaxy.discoverer)}
                {galaxy?.meanTemperature &&
                  galaxy?.minTemperature &&
                  galaxy?.maxTemperature &&
                  renderSubSection(
                    "Temperature",
                    "Minimum : " +
                      galaxy.minTemperature +
                      "\nMaxmimum : " +
                      galaxy.maxTemperature +
                      "\nMean : " +
                      galaxy.meanTemperature
                  )}
                {galaxy?.satelliteOf &&
                  renderSubSection("Satellite of", galaxy.satelliteOf)}
                {galaxy?.surfaceArea &&
                  renderSubSection("Surface", galaxy.surfaceArea)}
              </span>
            </div>
            <div className="col-span-3">
              {galaxy?.description &&
                renderSection("Description", galaxy.description)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Galaxy;
