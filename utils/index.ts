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

const prefixesWiki =
  "PREFIX wd: <http://www.wikidata.org/entity/>\n\
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>\n\
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
  PREFIX bd: <http://www.bigdata.com/rdf#>\n\
  PREFIX service: <http://wikiba.se/ontology#label>";

export const executeQuery = async (query: String): Promise<any> => {
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

export const executeWikiQuery = async (query: String) => {
  try {
    const { data } = await axios.get("https://query.wikidata.org/sparql", {
      params: { query: prefixesWiki + query, format: "json" },
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
  name: String
): Promise<AxiosResponse> => {
  const response = await executeQuery(`
        SELECT ?planet ?name ?description 
        WHERE {
            ?planet a dbo:Planet .
            OPTIONAL {?planet foaf:name ?name .}
            OPTIONAL {?planet dbo:abstract ?description FILTER(LANG(?description) = 'en') .}
            ${
              name !== ""
                ? `FILTER(CONTAINS(LCASE(?name), "${name.toLowerCase()}"))`
                : ""
            }
        }
        LIMIT 10
    `);
  return response.results.bindings;
};

export const searchPlanetById = async (id: string): Promise<AxiosResponse> => {
  const resourceId = `:${encodeURIComponent(id)}`;
  return await executeQuery(`
        SELECT ?name ?image ?mass ?volume ?gravity ?radius ?minTemperature ?meanTemperature ?maxTemperature ?discovered ?discovered ?satelliteOf ?surfaceArea ?orbitalPeriod ?wikipedia ?wikiPageID ?description 
        WHERE {
            ${resourceId.replace("(", "\\(").replace(")", "\\)")} a dbo:Planet.
            OPTIONAL {${resourceId
              .replace("(", "\\(")
              .replace(")", "\\)")} foaf:name ?name}.
            OPTIONAL {${resourceId
              .replace("(", "\\(")
              .replace(")", "\\)")} dbo:thumbnail ?image .}
            OPTIONAL {${resourceId
              .replace("(", "\\(")
              .replace(")", "\\)")} dbo:mass ?mass .}
            OPTIONAL {${resourceId
              .replace("(", "\\(")
              .replace(")", "\\)")} dbo:volume ?volume .}
            OPTIONAL {${resourceId
              .replace("(", "\\(")
              .replace(")", "\\)")} dbo:gravity ?gravity .}
            OPTIONAL {${resourceId
              .replace("(", "\\(")
              .replace(")", "\\)")} dbo:meanRadius ?radius .}
            OPTIONAL {${resourceId
              .replace("(", "\\(")
              .replace(")", "\\)")} dbo:meanTemperature ?meanTemperature .}
            OPTIONAL {${resourceId
              .replace("(", "\\(")
              .replace(")", "\\)")} dbo:minimumTemperature ?minTemperature .}
            OPTIONAL {${resourceId
              .replace("(", "\\(")
              .replace(")", "\\)")} dbo:maximumTemperature ?maxTemperature .}
            OPTIONAL {${resourceId
              .replace("(", "\\(")
              .replace(")", "\\)")} dbo:discovered ?discovered .}
            OPTIONAL {${resourceId
              .replace("(", "\\(")
              .replace(")", "\\)")} dbo:discoverer ?discoverer .}
            OPTIONAL {${resourceId
              .replace("(", "\\(")
              .replace(")", "\\)")} dbo:satelliteOf ?satelliteOf .}
            OPTIONAL {${resourceId
              .replace("(", "\\(")
              .replace(")", "\\)")} dbo:surfaceArea ?surfaceArea .}
            OPTIONAL {${resourceId
              .replace("(", "\\(")
              .replace(")", "\\)")} dbo:orbitalPeriod ?orbitalPeriod .}
            OPTIONAL {${resourceId
              .replace("(", "\\(")
              .replace(")", "\\)")} dbo:isPrimaryTopicOf ?wikipedia .}
            OPTIONAL {${resourceId
              .replace("(", "\\(")
              .replace(")", "\\)")} dbo:wikiPageID ?wikiPageID .}
            OPTIONAL {${resourceId
              .replace("(", "\\(")
              .replace(
                ")",
                "\\)"
              )} dbo:abstract ?description FILTER(LANG(?description) = 'en') .}
        }
    `);
};

export const searchGalaxyByName = async (
  name: String
): Promise<AxiosResponse> => {
  const response = await executeQuery(`
        SELECT ?galaxy ?name ?description 
        WHERE {
            ?galaxy a dbo:Galaxy .
            OPTIONAL {?galaxy foaf:name ?name .}
            OPTIONAL {?galaxy dbo:abstract ?description FILTER(LANG(?description) = 'en') .}
            ${
              name !== ""
                ? `FILTER(CONTAINS(LCASE(?name), "${name.toLowerCase()}"))`
                : ""
            }
        }
        LIMIT 10
    `);
  return response.results.bindings;
};

export const searchGalaxyById = async (id: string): Promise<AxiosResponse> => {
  const resourceId = `:${encodeURIComponent(id)}`;
  return await executeQuery(`
      SELECT ?name ?image ?type ?stars ?description ?wikipedia
        WHERE {
          ${resourceId.replace("(", "\\(").replace(")", "\\)")} a dbo:Galaxy .
            OPTIONAL {${resourceId
              .replace("(", "\\(")
              .replace(")", "\\)")} foaf:name ?name .}
            OPTIONAL {${resourceId
              .replace("(", "\\(")
              .replace(")", "\\)")} dbo:thumbnail ?image .}
            OPTIONAL {${resourceId
              .replace("(", "\\(")
              .replace(")", "\\)")} dbp:type ?type .}
            OPTIONAL {${resourceId
              .replace("(", "\\(")
              .replace(")", "\\)")} dbp:stars ?stars .}
            OPTIONAL {${resourceId
              .replace("(", "\\(")
              .replace(")", "\\)")} dbo:isPrimaryTopicOf ?wikipedia .}
            OPTIONAL {${resourceId
              .replace("(", "\\(")
              .replace(
                ")",
                "\\)"
              )} dbo:abstract ?description FILTER(LANG(?description) = 'en') .}
        }
    `);
};

export const searchStarByName = async (
  name: String
): Promise<AxiosResponse> => {
  const response = await executeQuery(`
  SELECT ?star ?name ?description 
  WHERE {
      ?star a dbo:Star .
      OPTIONAL {?star foaf:name ?name .}
      OPTIONAL {?star dbo:abstract ?description FILTER(LANG(?description) = 'en') .}
      ${
        name !== ""
          ? `FILTER(CONTAINS(LCASE(?name), "${name.toLowerCase()}"))`
          : ""
      }
  }
  LIMIT 10
`);
  return response.results.bindings;
};

export const searchStarById = async (id: string): Promise<AxiosResponse> => {
  const resourceId = `:${encodeURIComponent(id)}`;
  return await executeQuery(`
  SELECT ?name ?image ?distance ?mass ?description ?wikipedia ?wikiTitle
  WHERE {
    ${resourceId.replace("(", "\\(").replace(")", "\\)")} a dbo:Star .
    OPTIONAL {${resourceId
      .replace("(", "\\(")
      .replace(")", "\\)")} foaf:name ?name .}
    OPTIONAL {${resourceId
      .replace("(", "\\(")
      .replace(")", "\\)")} dbo:thumbnail ?image .}
    OPTIONAL {${resourceId
      .replace("(", "\\(")
      .replace(")", "\\)")} dbo:distance ?distance .}
    OPTIONAL {${resourceId
      .replace("(", "\\(")
      .replace(")", "\\)")} dbo:mass ?mass .}
    OPTIONAL {${resourceId
      .replace("(", "\\(")
      .replace(")", "\\)")} dbo:isPrimaryTopicOf ?wikipedia .}
    OPTIONAL {
      ${resourceId
        .replace("(", "\\(")
        .replace(")", "\\)")} foaf:isPrimaryTopicOf ?wikipedia .
      BIND(REPLACE(STR(?wikipedia), "^http://en.wikipedia.org/wiki/", "") AS ?wikiTitle)
    }
    OPTIONAL {
      ${resourceId
        .replace("(", "\\(")
        .replace(")", "\\)")} dbo:abstract ?description 
      FILTER(LANG(?description) = 'en') .
    }
  }
    `);
};

export const searchStarWikidata = async (
  id: String
): Promise<AxiosResponse> => {
  const resourceId: String = `${id}`;
  return await executeWikiQuery(`
    SELECT DISTINCT ?mass ?radius ?distanceFromEarth ?luminosity ?parentAstronomicalBody ?flattening ?spectralClass ?apparentMagnitude ?absoluteMagnitude ?metallicity ?density (SAMPLE(?temperatureValueCenter) AS ?temperatureCenter) (SAMPLE(?temperatureValuePhotosphere) AS ?temperaturePhotosphere) (SAMPLE(?temperatureValueCorona) AS ?temperatureCorona) (SAMPLE(?areaValue) AS ?area) ?volume ?perimeter ?astronomicSymbolImage ?depictedBy ?notation ?describedBySource
    WHERE {
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      ?star rdfs:label "${resourceId}"@en .
      OPTIONAL { ?star wdt:P2067 ?mass. }
      OPTIONAL { ?star wdt:P2120 ?radius. }
      OPTIONAL { ?star wdt:P2583 ?distanceFromEarth. }
      OPTIONAL { ?star wdt:P1102 ?flattening. }
      OPTIONAL { ?star wdt:P215 ?spectralClass. }
      OPTIONAL { ?star wdt:P2060 ?luminosity. }
      OPTIONAL { ?star wdt:P1215 ?apparentMagnitude. }
      OPTIONAL { ?star wdt:P1457 ?absoluteMagnitude. }
      OPTIONAL { ?star wdt:P2227 ?metallicity. }
      OPTIONAL { ?star wdt:P2054 ?density. }
      OPTIONAL {
        ?star p:P2076 ?temperatureStatementCenter.
        ?temperatureStatementCenter ps:P2076 ?temperatureValueCenter.
        ?temperatureStatementCenter pq:P518 ?temperaturePartCenter.
        FILTER(?temperaturePartCenter = wd:Q23595)
      }
      OPTIONAL {
        ?star p:P2076 ?temperatureStatementPhotosphere.
        ?temperatureStatementPhotosphere ps:P2076 ?temperatureValuePhotosphere.
        ?temperatureStatementPhotosphere pq:P518 ?temperaturePartPhotosphere.
        FILTER(?temperaturePartPhotosphere = wd:Q6372)
      }
      OPTIONAL {
        ?star p:P2076 ?temperatureStatementCorona.
        ?temperatureStatementCorona ps:P2076 ?temperatureValueCorona.
        ?temperatureStatementCorona pq:P518 ?temperaturePartCorona.
        FILTER(?temperaturePartCorona = wd:Q170754)
      }
      OPTIONAL {
        ?star p:P2046 ?areaStatement.
        ?areaStatement ps:P2046 ?areaValue.
      }
      OPTIONAL { ?star wdt:P2234 ?volume. }
      OPTIONAL { ?star wdt:P2547 ?perimeter. }
      OPTIONAL { ?star wdt:P367 ?astronomicSymbolImage. }
      OPTIONAL { ?star wdt:P398 ?childAstronomicalBody. }
      OPTIONAL { ?star wdt:P397 ?parentAstronomicalBody. }
      OPTIONAL { ?star wdt:P18 ?image. }

    }
    GROUP BY ?mass ?radius ?distanceFromEarth ?luminosity ?parentAstronomicalBody ?flattening ?spectralClass ?apparentMagnitude ?absoluteMagnitude ?metallicity ?density ?volume ?perimeter ?astronomicSymbolImage ?depictedBy ?notation ?describedBySource
    LIMIT 1
    `);
};

export const searchPlanetWikidata = async (
  id: String
): Promise<AxiosResponse> => {
  const resourceId: String = `${id}`;
  return await executeWikiQuery(`
  
  `);
};

export const searchGalaxyWikidata = async (
  id: String
): Promise<AxiosResponse> => {
  const resourceId: String = `${id}`;
  return await executeWikiQuery(`
  
  `);
};

export const getWikipediaImage = async (id: String) => {
  try {
    const { data } = await axios.get(
      "https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php",
      {
        params: {
          action: "query",
          titles: id,
          prop: "pageimages",
          pithumbsize: 300,
          format: "json",
        },
      }
    );

    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];

    const imageUrl = pages[pageId].thumbnail?.source as string;

    return imageUrl;
  } catch (error) {
    console.error("Error fetching Wikipedia image:", error);
    return null;
  }
};
