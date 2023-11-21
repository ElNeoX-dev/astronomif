import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { CustomCanvas } from "@/components";

import {renderSection } from "@/utils";
import Link from "next/link";
import { renderSubSection } from "@/utils/utils";

interface aboutProp {}

const About: React.FC<aboutProp> = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const [loading, setLoading] = useState(true);
  const [modelPath, setModelPath] = useState("/models/unknown/scene.gltf"); // New state variable for model path

  useEffect(() => {
    if (!id) return;
    
    setLoading(false);
  }, [id]);

  // Function to simulate checking if the model path exists

  return (
    <>
      <Head>
        <title>{(id || "Loading") as ReactNode}</title>
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
            {(id ? id.replace(/_/g, " ") : "Loading") as ReactNode}
          </h1>
        </div>
        <div className="overflow-x-hidden overflow-y-scroll text-justify">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 ">
              {/* <CustomCanvas modelPath={modelPath} /> */}
            </div>
            <div className="flex-grow md:col-span-2 overflow-x-hidden overflow-y-scroll text-justify">
              <span className="text-justify ">
                  {renderSubSection("Autors", "BECKMANN Mark", "GUILLOT Evann", "HADDAD Zyad", "MARTIN Noham", "MOREL Tim", "ROULIER Marie", "WARIN Hugo")}
                  {renderSubSection("Data Sources", "All data used in this website comes from DBPedia (https://wiki.dbpedia.org/) and Wikidata (https://http://wikidata.org/)", "–––", "DBPedia is a crowd-sourced community effort to extract structured content from the information created in various Wikimedia projects. This structured information resembles an open knowledge graph (OKG) which is available for everyone on the Web. DBpedia allows users to semantically query relationships and properties of Wikipedia resources, including links to other related datasets.", "–––", "WikiData is a free and open knowledge base that can be read and edited by both humans and machines. Wikidata acts as central storage for the structured data of its Wikimedia sister projects including Wikipedia, Wikivoyage, Wiktionary, Wikisource, and others.")}
                  {renderSubSection("3D Model Credits ", "* title:	Planet Earth", "* source:	https://sketchfab.com/3d-models/planet-earth-babd284930204736a938915ceb0a6535", "* author:	JanesBT (https://sketchfab.com/JanesBt", "–––", "* title:	Galaxy", "* source:	https://sketchfab.com/3d-models/galaxy-dbb2f075329747a09cc8add2ad05acad", "* author:	991519166 (https://sketchfab.com/991519166)", "–––", "Model License:", "* license type:	CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)")}
                  </span>
            </div>
          </div>
        </div>
      </div>      
    </>
  );
};

export default About;
