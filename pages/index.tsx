import { useState, useRef, ChangeEvent } from "react";
import { CustomInput, SearchBox, EarthCanvas } from "@/components";
import Head from "next/head";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const debounceSearchRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    if (debounceSearchRef.current) {
      clearTimeout(debounceSearchRef.current);
    }
    debounceSearchRef.current = setTimeout(() => {
      setSearchTerm(e.target.value);
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>Astronom'IF</title>
      </Head>
      <div className="flex flex-col">
        <h1 className="title mb-15">Astronom'IF</h1>
        <h2 className="font-thin opacity-50 text-center unselectable">
          The first dedicated astronomy search engine
        </h2>
        <CustomInput
          onChange={handleSearchChange}
          setIsFocused={setIsFocused}
        />
        {isFocused && (
          <SearchBox
            searchTerm={searchTerm}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
        <EarthCanvas />
      </div>
    </>
  );
}
