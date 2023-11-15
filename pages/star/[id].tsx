"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { searchStarById, searchStarByName } from "@/utils";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

interface StarProps {}

interface Star {
  name?: string;
  type?: string;
  distance?: string;
  mass?: string;
  description?: string;
}

const star: React.FC<StarProps> = () => {
  const router = useRouter();

  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [star, setStar] = useState<Star>();

  useEffect(() => {
    if (!id) return;
    searchStarById(id as string)
      .then((response) => {
        const star = (response as any)?.results?.bindings[0];
        console.log(response);
        if (star) {
          for (const key in star) {
            star[key] = star[key]?.value;
          }
          setStar(star);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        alert("star not found");
      });
  }, [id]);

  return (
    <>
      <Head>
        <title>{(star ? star.name : "Loading") as ReactNode}</title>
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
            {(star ? star.name : "Loading") as ReactNode}
          </h1>
        </div>
        <div className="col-span-3">{star?.description}</div>
      </div>
    </>
  );
};

export default star;
