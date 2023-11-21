"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CustomCanvas, SaturnCanvas } from "@/components";

import {
  searchGalaxyByIdWiki,
  searchGalaxyByNameDBP,
  getWikipediaImage,
  getType,
} from "@/utils";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { renderSubSection, renderSection } from "@/utils/utils";

interface GalaxyProps {}

interface Galaxy {
  name?: string;
  type?: string;
  image?: string;
  imageWikipedia?: string;
  stars?: string;
  description?: string;
  wikipedia?: string;
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
    (async function fetchData() {
      if (!id) return;
      try {
        const responseWikidata = await searchGalaxyByIdWiki(id);
        const galaxyWiki = responseWikidata.at(0);
        if (galaxyWiki) {
          for (const key in galaxyWiki) {
            galaxyWiki[key] = galaxyWiki[key]?.value;
          }

          const responseDBP = await searchGalaxyByNameDBP(galaxyWiki.name);
          const galaxyDBP = responseDBP.at(0);

          if (galaxyDBP) {
            for (const key in galaxyWiki) {
              galaxyWiki[key] = galaxyWiki[key]?.value;
            }
          }

          const mergedGalaxy = {
            ...galaxyDBP,
            ...galaxyWiki,
          };

          setGalaxy(mergedGalaxy);

          try {
            const imageURL = await getWikipediaImage(id as string);
            mergedGalaxy.imageURL = imageURL;
          } catch (error) {
            console.log(error);
          }
          const type = await getType(
            galaxyWiki?.parentAstronomicalBody?.split("/").at(-1)!
          );
          mergedGalaxy.typeParent = type;
          console.log(mergedGalaxy);

          setGalaxy(mergedGalaxy);

          checkModelPath(id);
        } else {
          alert("Galaxy not found");
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    })();
  }, [id]);

  // Function to simulate checking if the model path exists
  const checkModelPath = (galaxyName: string) => {
    // Replace this logic with your actual check
    const knownGalaxys = ["Milky_Way"]; // Example list of known galaxys
    const pathExists = knownGalaxys.includes(galaxyName);
    setModelPath(
      pathExists
        ? `/models/${galaxyName}/scene.gltf`
        : "/models/unknown_galaxy/scene.gltf"
    );
  };

  return (
    <>
      <Head>
        <title>{(id ? id.replace(/_/g, " ") : "Loading") as ReactNode}</title>
      </Head>
      <div className="flex py-2 px-4 flex-col flex-grow overflow-x-hidden overflow-y-auto hide-scrollbar">
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
                {galaxy?.type && renderSubSection("Type", galaxy.type + "")}
                {galaxy?.stars &&
                  renderSubSection("Number of stars", galaxy.stars + "")}
              </span>
            </div>
            <div className="col-span-3 pr-3">
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
