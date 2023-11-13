"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { searchGalaxyById, searchGalaxyByName } from "@/utils";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

interface GalaxyProps {}

interface Galaxy {
  name?: string;
  type?: string;
  distance?: string;
  mass?: string;
  description?: string;
}

const galaxy: React.FC<GalaxyProps> = () => {
  const router = useRouter();

  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [galaxy, setGalaxy] = useState<Galaxy>();

  useEffect(() => {
    if (!id) return;
    searchGalaxyById(id as string)
      .then((response) => {
        const galaxy = (response as any)?.results?.bindings[0];
        console.log(galaxy);
        if (galaxy) {
          for (const key in galaxy) {
            galaxy[key] = galaxy[key]?.value;
          }
          setGalaxy(galaxy);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        alert("galaxy not found");
      });
  }, [id]);

  return (
    <>
      <Head>
        <title>{(galaxy ? galaxy.name : "Loading") as ReactNode}</title>
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
            {(galaxy ? galaxy.name : "Loading") as ReactNode}
          </h1>
        </div>
        <div className="col-span-3">{galaxy?.description}</div>
      </div>
    </>
  );
};

export default galaxy;
