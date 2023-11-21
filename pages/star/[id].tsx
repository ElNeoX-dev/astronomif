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
  image?: string;
  imageWikipedia?: string;
  distance?: string;
  mass?: string;
  description?: string;
  wikipedia?: string;
  wikiTitle?: string;
  radius?: string;
  distanceFromEarth?: string;
  luminosity?: string;
  parentAstronomicalBody?: string;
  flattening?: string;
  spectralClass?: string;
  apparentMagnitude?: string;
  absoluteMagnitude?: string;
  metallicity?: string;
  density?: string;
  temperatureCenter?: string;
  temperatureValuePhotosphere?: string;
  temperatureCorona?: string;
  area?: string;
  volume?: string;
  perimeter?: string;
  astronomicSymbolImage?: string;
  depictedBy?: string;
  notation?: string;
  describedBySource?: string;
}

const Star: React.FC<StarProps> = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const [loading, setLoading] = useState(true);
  const [star, setStar] = useState<Star>();
  const [modelPath, setModelPath] = useState("/models/unknown/scene.gltf"); // New state variable for model path

  /*useEffect(() => {
    if (!id) return;
    // recherche DBPedia
    searchStarById(id as string)
      .then(async (response) => {
        const starDBP = (response as any)?.results?.bindings[0];
        if (starDBP) {
          for (const key in starDBP) {
            starDBP[key] = starDBP[key]?.value;
          }
          setStar(starDBP);
          // recherche Wikidata
          searchStarWikidata(starDBP.wikiTitle).then(
            async (responseWikidata) => {
              const starWiki = (responseWikidata as any)?.results?.bindings[0];
              if (starWiki) {
                for (const key in starWiki) {
                  starWiki[key] = starWiki[key]?.value;

                }
                setStar(starWiki);
              }
            }
          );
        }

        // recherche Wikipedia Image
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
  }, [id]);*/

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
  
      try {
        const responseDBP = await searchStarById(id as string);
        const starDBP = (responseDBP as any)?.results?.bindings[0];
  
        if (starDBP) {
          for (const key in starDBP) {
            starDBP[key] = starDBP[key]?.value;
          }
  
          // Recherche Wikidata
          const responseWikidata = await searchStarWikidata(starDBP.wikiTitle);
          const starWiki = (responseWikidata as any)?.results?.bindings[0];
  
          if (starWiki) {
            for (const key in starWiki) {
              starWiki[key] = starWiki[key]?.value;
            }
          }
  
          // Recherche Wikipedia Image
          const imageURL = await getWikipediaImage(id as string);
  
          // Fusionner les données
          const mergedStar = { ...starDBP, ...starWiki, imageWikipedia: imageURL };
          setStar(mergedStar);
  
          // Après avoir fusionné les données, vous pouvez effectuer d'autres actions ici si nécessaire.
          checkModelPath(id);
          console.log(imageURL);
        } else {
          // Gérer le cas où starDBP n'est pas défini.
          // Par exemple, afficher un message d'erreur.
          console.error("Star not found");
          alert("Star not found");
        }
      } catch (error) {
        // Gérer les erreurs ici
        console.error(error);
        alert("Error fetching data");
      }
    }
  
    fetchData();
  }, [id]);
  

  // Function to simulate checking if the model path exists
  const checkModelPath = (starName: string) => {
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
      <div className="flex flex-col py-2 px-4 flex-grow overflow-x-hidden overflow-y-auto">
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
              {star?.distance &&
                renderSubSection("Distance", star.distance + " km")}
              {star?.radius && renderSubSection("Radius", star.radius + " km")}
              {star?.distanceFromEarth && renderSubSection("Distance from Earth", star.distanceFromEarth + " AU")}
              {star?.luminosity && renderSubSection("Luminosity", star.luminosity + " W")}
              {star?.parentAstronomicalBody && renderSubSection("Parent Astronomical Body", star.parentAstronomicalBody)}
              {star?.area && renderSubSection("Area", star.area + " km²")}
              {star?.volume && renderSubSection("Volume", star.volume + " km³")}
              {star?.perimeter && renderSubSection("Perimeter", star.perimeter + " km")}
              </span>
            </div>
            <div className="col-span-3 pr-3">
              {star?.description &&
                renderSection("Description", star.description)}
              {star?.type && renderSubSection("Type", star.type)}
              
              {star?.flattening && renderSubSection("Flattening", star.flattening)}
              {star?.spectralClass && renderSubSection("Spectral Class", star.spectralClass)}
              {star?.apparentMagnitude && star?.absoluteMagnitude && renderSubSection("Magnitude : ", "Apparent magnitude ; " + star.apparentMagnitude, "Absolute magnitude ; " + star.absoluteMagnitude,)}
              {star?.metallicity && renderSubSection("Metallicity", star.metallicity)}
              {star?.density && renderSubSection("Density", star.density)}
              {star?.temperatureCenter && renderSubSection("Temperature Center", star.temperatureCenter + " K")}
              {star?.temperatureValuePhotosphere && renderSubSection("Temperature Photosphere", star.temperatureValuePhotosphere + " K")}
              {star?.temperatureCorona && renderSubSection("Temperature Corona", star.temperatureCorona + " K")}
              {star?.astronomicSymbolImage && renderSubSection("Astronomic Symbol Image", star.astronomicSymbolImage)}
              {star?.depictedBy && renderSubSection("Depicted By", star.depictedBy)}
              {star?.notation && renderSubSection("Notation", star.notation)}
              {star?.describedBySource && renderSubSection("Described By Source", star.describedBySource)}
                
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Star;
