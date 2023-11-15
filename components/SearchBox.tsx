"use client";

import { useState, useEffect } from "react";

import { ListItem, Loading } from ".";
import {
  searchGalaxyByName,
  searchPlanetByName,
  searchStarByName,
} from "@/utils";
import { get } from "https";

interface SearchBoxProps {
  searchTerm: String;
  isLoading: Boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<Boolean>>;
}

interface Item {
  title: string;
  type: string;
  description: string;
  link: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  searchTerm,
  isLoading,
  setIsLoading,
}) => {
  const [items, setItems] = useState<Item[]>([]);

  const getIdFromUri = (uri: string) => {
    return uri.split("/").at(-1);
  };

  useEffect(() => {
    (async () => {
      try {
        setItems([]);
        console.log("AZOIEJAZOIEJ");
        const responseGalaxy = (await searchGalaxyByName(searchTerm)) as any;
        console.log("aze");
        const responsePlanet = (await searchPlanetByName(searchTerm)) as any;
        const responseStar = (await searchStarByName(searchTerm)) as any;
        const response: Item[] = [];
        for (
          let i = 0;
          i <
          Math.max(
            responseGalaxy.length,
            responsePlanet.length,
            responseStar.length
          );
          i++
        ) {
          responseGalaxy[i] &&
            response.push({
              title: responseGalaxy[i].name.value,
              type: "Galaxy",
              link: `/galaxy/${getIdFromUri(responseGalaxy[i].galaxy.value)}`,
              description: responseGalaxy[i].description.value,
            });
          responsePlanet[i] &&
            response.push({
              title: responsePlanet[i].name.value,
              type: "Planet",
              link: `/planet/${getIdFromUri(responsePlanet[i].planet.value)}`,
              description: responsePlanet[i].description.value,
            });
          responseStar[i] &&
            response.push({
              title: responseStar[i].name.value,
              type: "Star",
              link: `/star/${getIdFromUri(responseStar[i].star.value)}`,
              description: responseStar[i].description.value,
            });
        }
        setItems(response);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    })();
  }, [searchTerm]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex-col flex rounded-xl bg-white/20">
          {items?.map((item) => (
            <ListItem
              key={item.title}
              title={item.title}
              type={item.type}
              description={item.description}
              link={item.link}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default SearchBox;
