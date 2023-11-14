import axios, { AxiosResponse } from "axios";

import { renderSection } from "./utils";

export { renderSection };

const prefixes =
  "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n\
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n\
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n\
PREFIX dc: <http://purl.org/dc/elements/1.1/>\n\
PREFIX dbo: <http://dbpedia.org/ontology/>\n\
PREFIX : <http://dbpedia.org/resource/>\n\
PREFIX dbpedia2: <http://dbpedia.org/property/>\n\
PREFIX dbpedia: <http://dbpedia.org/>\n\
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n\
PREFIX dbr: <http://dbpedia.org/resource/>\n\
PREFIX dbp: <http://dbpedia.org/property/>\n\
\n";

export const executeQuery = async (query: string) => {
  try {
    const { data } = await axios.get("http://dbpedia.org/sparql", {
      params: { query: prefixes + query, format: "json" },
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const listPlanets = async (): Promise<AxiosResponse> => {
  return await executeQuery(`
        SELECT ?planet ?name ?mass ?volume ?gravity ?description 
        WHERE {
            ?planet a dbo:Planet .
            OPTIONAL {?planet foaf:name ?name .}
            OPTIONAL {?planet dbo:mass ?mass .}
            OPTIONAL {?planet dbo:volume ?volume .}
            OPTIONAL {?planet dbo:gravity ?gravity .}
            OPTIONAL {?planet dbo:abstract ?description FILTER(LANG(?description) = 'en') .}
        }
        LIMIT 50
  `);
};

export const searchPlanetByName = async (
  name: string
): Promise<AxiosResponse> => {
  return await executeQuery(`
        SELECT ?planet ?name ?mass ?volume ?gravity ?description 
        WHERE {
            ?planet a dbo:Planet .
            OPTIONAL {?planet foaf:name ?name .}
            OPTIONAL {?planet dbo:mass ?mass .}
            OPTIONAL {?planet dbo:volume ?volume .}
            OPTIONAL {?planet dbo:gravity ?gravity .}
            OPTIONAL {?planet dbo:abstract ?description FILTER(LANG(?description) = 'en') .}
            FILTER(CONTAINS(LCASE(?name), "${name.toLowerCase()}"))
        }
    `);
};

export const searchPlanetById = async (id: string): Promise<AxiosResponse> => {
  const resourceId: string = `:${id}`;
  return await executeQuery(`
        SELECT ?name ?image ?mass ?volume ?gravity ?radius ?minTemperature ?meanTemperature ?maxTemperature ?discovered ?discovered ?satelliteOf ?surfaceArea ?orbitalPeriod ?wikipedia ?wikiPageID ?description 
        WHERE {
            ${resourceId} a dbo:Planet.
            OPTIONAL {${resourceId} foaf:name ?name}.
            OPTIONAL {${resourceId} dbo:thumbnail ?image .}
            OPTIONAL {${resourceId} dbo:mass ?mass .}
            OPTIONAL {${resourceId} dbo:volume ?volume .}
            OPTIONAL {${resourceId} dbo:gravity ?gravity .}
            OPTIONAL {${resourceId} dbo:meanRadius ?radius .}
            OPTIONAL {${resourceId} dbo:meanTemperature ?meanTemperature .}
            OPTIONAL {${resourceId} dbo:minimumTemperature ?minTemperature .}
            OPTIONAL {${resourceId} dbo:maximumTemperature ?maxTemperature .}
            OPTIONAL {${resourceId} dbo:discovered ?discovered .}
            OPTIONAL {${resourceId} dbo:discoverer ?discoverer .}
            OPTIONAL {${resourceId} dbo:satelliteOf ?satelliteOf .}
            OPTIONAL {${resourceId} dbo:surfaceArea ?surfaceArea .}
            OPTIONAL {${resourceId} dbo:orbitalPeriod ?orbitalPeriod .}
            OPTIONAL {${resourceId} dbo:isPrimaryTopicOf ?wikipedia .}
            OPTIONAL {${resourceId} dbo:wikiPageID ?wikiPageID .}
            OPTIONAL {${resourceId} dbo:abstract ?description FILTER(LANG(?description) = 'en') .}
        }
    `);
};

export const getInfosPlanet = async (name: string): Promise<AxiosResponse> => {
  return await executeQuery(`
        SELECT ?apoapsis ?periapsis ?averageSpeed ?maxTemperature ?meanTemperature ?minTemperature ?volume
        WHERE {
            dbr:${name} dbo:apoapsis ?apoapsis ;
                        dbo:periapsis ?periapsis ;
                        dbo:averageSpeed ?averageSpeed ;
                        dbo:maximumTemperature ?maxTemperature ;
                        dbo:meanTemperature ?meanTemperature ;
                        dbo:minimumTemperature ?minTemperature ;
                        dbo:volume ?volume .
        }
        LIMIT 1
    `);
};

export const listStars = async (): Promise<AxiosResponse> => {
  return await executeQuery(`
        SELECT ?star ?name ?mass ?luminosity ?constellation ?description 
        WHERE {
            ?star a dbo:Star .
            OPTIONAL {?star foaf:name ?name .}
            OPTIONAL {?star dbo:mass ?mass .}
            OPTIONAL {?star dbo:luminosity ?luminosity .}
            OPTIONAL {?star dbo:constellation ?constellation .}
            OPTIONAL {?star dbo:abstract ?description FILTER(LANG(?description) = 'en') .}
        }
        LIMIT 50
    `);
};

export const listGalaxies = async (): Promise<AxiosResponse> => {
  return await executeQuery(`
        SELECT ?galaxy ?name ?type ?distance ?mass ?description 
        WHERE {
            ?galaxy a dbo:Galaxy .
            OPTIONAL {?galaxy foaf:name ?name .}
            OPTIONAL {?galaxy dbo:type ?type .}
            OPTIONAL {?galaxy dbo:distance ?distance .}
            OPTIONAL {?galaxy dbo:mass ?mass .}
            OPTIONAL {?galaxy dbo:abstract ?description FILTER(LANG(?description) = 'en') .}
        }
        LIMIT 50
    `);
};

export const searchGalaxyByName = async (
  name: string
): Promise<AxiosResponse> => {
  return await executeQuery(`
        SELECT ?galaxy ?name ?type ?distance ?mass ?description 
        WHERE {
            ?galaxy a dbo:Galaxy .
            OPTIONAL {?galaxy foaf:name ?name .}
            OPTIONAL {?galaxy dbo:type ?type .}
            OPTIONAL {?galaxy dbo:distance ?distance .}
            OPTIONAL {?galaxy dbo:mass ?mass .}
            OPTIONAL {?galaxy dbo:abstract ?description FILTER(LANG(?description) = 'en') .}
            FILTER(CONTAINS(LCASE(?name), "${name.toLowerCase()}"))
        }
        LIMIT 50
    `);
};

export const searchGalaxyById = async (id: string): Promise<AxiosResponse> => {
  const resourceId: string = `:${id}`;
  return await executeQuery(`
      SELECT ?name ?type ?distance ?mass ?description 
        WHERE {
          ${resourceId} a dbo:Galaxy .
            OPTIONAL {${resourceId} foaf:name ?name .}
            OPTIONAL {${resourceId} dbo:type ?type .}
            OPTIONAL {${resourceId} dbo:distance ?distance .}
            OPTIONAL {${resourceId} dbo:mass ?mass .}
            OPTIONAL {${resourceId} dbo:abstract ?description FILTER(LANG(?description) = 'en') .}
        }
    `);
};

export const searchStarByName = async (
  name: string
): Promise<AxiosResponse> => {
  return await executeQuery(`
        SELECT ?star ?name ?type ?distance ?mass ?description 
        WHERE {
            ?star a dbo:Galaxy .
            OPTIONAL {?star foaf:name ?name .}
            OPTIONAL {?star dbo:type ?type .}
            OPTIONAL {?star dbo:distance ?distance .}
            OPTIONAL {?star dbo:mass ?mass .}
            OPTIONAL {?star dbo:abstract ?description FILTER(LANG(?description) = 'en') .}
            FILTER(CONTAINS(LCASE(?name), "${name.toLowerCase()}"))
        }
        LIMIT 50
    `);
};

export const searchStarById = async (id: string): Promise<AxiosResponse> => {
  const resourceId: string = `:${id}`;
  return await executeQuery(`
      SELECT ?name ?type ?distance ?mass ?description 
        WHERE {
          ${resourceId} a dbo:Star .
            OPTIONAL {${resourceId} foaf:name ?name .}
            OPTIONAL {${resourceId} dbo:type ?type .}
            OPTIONAL {${resourceId} dbo:distance ?distance .}
            OPTIONAL {${resourceId} dbo:mass ?mass .}
            OPTIONAL {${resourceId} dbo:abstract ?description FILTER(LANG(?description) = 'en') .}
        }
    `);
};

export const getWikipediaImage = async (id: string) => {
  try {
    const { data } = await axios.get("https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php", {
      params: { action: "query", titles: id, prop:"pageimages", pithumbsize: 300, format: "json" },
    });
    
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];

    const imageUrl = pages[pageId].thumbnail?.source as string;

    return imageUrl;
  } catch (error) {
    console.error("Error fetching Wikipedia image:", error);
    return null;
  }
};