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
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [searchTerm, setSearchTerm] = useState<String>("");
  const [isFocused, setIsFocused] = useState<Boolean>(false);

  const [isHoverPlanet, setIsHoverPlanet] = useState<Boolean>(false);
  const [isHoverGalaxy, setIsHoverGalaxy] = useState<Boolean>(false);
  const [isHoverStar, setIsHoverStar] = useState<Boolean>(false);

  const [planetFilter, setPlanetFilter] = useState<Boolean>(false);
  const [galaxyFilter, setGalaxyFilter] = useState<Boolean>(false);
  const [starFilter, setStarFilter] = useState<Boolean>(false);

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

  useEffect(() => {
    setIsLoading(false);
  }, [isFocused]);

  return (
    <>
      <Head>
        <title>Astronom'IF</title>
      </Head>
      <div className="flex flex-col researchDiv w-full justify-center items-center">
        <img
          src="/logo.gif"
          width="300"
          alt="Astronom'IF Logo"
          className="logo-class"
          style={{ maxWidth: "100px", margin: "0 auto" }}
        />
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
            galaxyFilter={galaxyFilter}
            planetFilter={planetFilter}
            starFilter={starFilter}
          />
        )}
      </div>
      {
        <div
          className={`flex flex-row self-center ${
            isFocused ? "filter-out" : ""
          } ${!isFocused ? "filter-in" : ""}`}
        ></div>
      }
      <div className="flex flex-row self-center">
        <div className="button-3d">
          <CustomButton setState={setGalaxyFilter} state={galaxyFilter}>
            <GalaxyCanvas
              setHoverState={setIsHoverGalaxy}
              hoverState={isHoverGalaxy}
              setActiveState={setGalaxyFilter}
              activeState={galaxyFilter}
            />
          </CustomButton>
        </div>
        <div className="button-3d">
          <CustomButton setState={setPlanetFilter} state={planetFilter}>
            <EarthCanvas
              setHoverState={setIsHoverPlanet}
              hoverState={isHoverPlanet}
              setActiveState={setPlanetFilter}
              activeState={planetFilter}
            />
            planetFilter
          </CustomButton>
        </div>
        <div className="button-3d">
          <CustomButton setState={setStarFilter} state={starFilter}>
            <SunCanvas
              setHoverState={setIsHoverStar}
              hoverState={isHoverStar}
              setActiveState={setStarFilter}
              activeState={starFilter}
            />
          </CustomButton>
        </div>
      </div>
    </>
  );
}
