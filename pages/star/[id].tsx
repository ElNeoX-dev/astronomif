"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CustomCanvas, SaturnCanvas } from "@/components";

import {
  searchStarById,
  getWikipediaImage,
  renderSection,
  searchStarWikidata,
} from "@/utils";

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { renderSubSection } from "@/utils/utils";

interface StarProps {}

interface Star {
  name?: string;
  type?: string;
  distance?: string;
  mass?: string;
  description?: string;
}

const Star: React.FC<StarProps> = () => {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [star, setStar] = useState<Star>();
  const [modelPath, setModelPath] = useState("/models/unknown/scene.gltf"); // New state variable for model path
  const [starWiki, setStarWiki] = useState<StarWiki>();

  useEffect(() => {
    if (!id) return;
    searchStarById(id as string)
      .then(async (response) => {
        const star = (response as any)?.results?.bindings[0];
        console.log(response);
        if (star) {
          for (const key in star) {
            star[key] = star[key]?.value;
          }
          setStar(star);
          // recherche
          const responseWiki = await searchStarWikidata(star.wikiTitle);
          console.log(responseWiki);
        }
        getWikipediaImage(id as string).then((imageURL) => {
          if (star) {
            star.imageWikipedia = imageURL!;
          }
          setStar(star);
          checkModelPath(id); // Check for model path when a star is found
          console.log(imageURL);
        });
      })
      .catch((error) => {
        console.log(error);
        alert("Image not found");
      })
      .catch((error) => {
        console.log(error);
        alert("Star not found");
      });
  }, [id]);

  // Function to simulate checking if the model path exists
  const checkModelPath = (starName) => {
    // Replace this logic with your actual check
    const knownStars = ["Sun"]; // Example list of known stars
    const pathExists = knownStars.includes(starName);
    setModelPath(
      pathExists
        ? `/models/${starName}/scene.gltf`
        : "/models/unknown/scene.gltf"
    );
  };

  return (
    <>
      <Head>
        <title>{(id ? id.replace(/_/g, " ") : "Loading") as ReactNode}</title>
      </Head>
      <div className="flex flex-col flex-grow overflow-x-hidden overflow-y-auto">
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
            {(star ? id : "Loading") as ReactNode}
          </h1>
        </div>
        <div className="overflow-x-hidden overflow-y-scroll text-justify">
          <div className="grid grid-cols-4 gap-x-2">
            <div className="col-span-1 flex flex-col items-left">
              <div className="object-3d">
                <CustomCanvas modelPath={modelPath} />
              </div>
              <Image
                className="mb-2 rounded-xl"
                src={star?.imageWikipedia || star?.image || "/logo.gif"}
                alt={star?.name || "Loading"}
                width={300}
                height={300}
              />
              <span className="flex-grow mr-2">
                {star?.mass && renderSubSection("Mass", star.mass + "kg")}
                {star?.volume && renderSubSection("Volume", star.volume)}
                {star?.radius && renderSubSection("Radius", star.radius)}
                {star?.discovered &&
                  renderSubSection("Date of discover", star.discovered)}
                {star?.discoverer &&
                  renderSubSection("Discoverer", star.discoverer)}
                {star?.meanTemperature &&
                  star?.minTemperature &&
                  star?.maxTemperature &&
                  renderSubSection(
                    "Temperature",
                    "Minimum : " +
                      star.minTemperature +
                      "\nMaxmimum : " +
                      star.maxTemperature +
                      "\nMean : " +
                      star.meanTemperature
                  )}
                {star?.satelliteOf &&
                  renderSubSection("Satellite of", star.satelliteOf)}
                {star?.surfaceArea &&
                  renderSubSection("Surface", star.surfaceArea)}
              </span>
            </div>
            <div className="col-span-3">
              {star?.description &&
                renderSection("Description", star.description)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Star;
