import { useState, useEffect, useRef, ChangeEvent } from "react";
import {
  CustomInput,
  SearchBox,
  EarthCanvas,
  GalaxyCanvas,
  SunCanvas,
  CustomButton,
} from "@/components";
import Head from "next/head";

export default function Home() {
  const [title, setTitle] = useState("Astronom'IF");

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setTitle("Astronom'IF - Mobile");
      } else {
        setTitle("Astronom'IF");
      }
    }

    window.addEventListener("resize", handleResize);

    // Set initial title
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
        <title>{title}</title>
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
        <div className="flex flex-row self-center">
          <div className="galaxy">
            <CustomButton onClick={async () => {}}>
              <GalaxyCanvas />
            </CustomButton>
          </div>
          <div className="galaxy">
            <CustomButton onClick={async () => {}}>
              <EarthCanvas />
            </CustomButton>
          </div>
          <div className="galaxy">
            <CustomButton onClick={async () => {}}>
              <SunCanvas />
            </CustomButton>
          </div>
        </div>
      </div>
    </>
  );
}
