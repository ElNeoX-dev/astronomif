"use client";

import { useState, useEffect } from "react";

import { ListItem, Loading } from ".";
import { listGalaxies } from "@/utils";

interface SearchBoxProps {
  searchTerm: string;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Item {
  imageUrl: string;
  title: string;
  description: string;
  link: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  searchTerm,
  isLoading,
  setIsLoading,
}) => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    (async () => {
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
              imageUrl={item.imageUrl}
              title={item.title}
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
