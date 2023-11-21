import axios, { AxiosResponse } from "axios";

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

const listGalaxyCodes = [
  // "Q318",
  "Q2488",
];
const listPlanetCodes = ["Q634", "Q128207"];
const listStarCodes = [
  // "Q523",
  "Q5864",
];

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

export const searchPlanetByNameDBP = async (name: String): Promise<any[]> => {
  const resourceId = `:${name.replace(/ /g, "_")}`;
  const response = await executeQuery(`
        SELECT ?description ?image ?mass ?volume ?gravity ?radius ?minTemperature ?meanTemperature ?maxTemperature ?discovered ?discovered ?satelliteOf ?surfaceArea ?orbitalPeriod ?wikipedia ?wikiPageID
        WHERE {
            ${resourceId} a dbo:Planet .
            ${resourceId} foaf:name ?name filter (lang(?name) = "en").
            OPTIONAL {${resourceId} dbo:abstract ?description FILTER(LANG(?description) = 'en') .}
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
        }
        LIMIT 1
    `);
  return response.results?.bindings;
};

export const searchPlanetByNameWiki = async (name: String): Promise<any[]> => {
  const response = await executeWikiQuery(`
      SELECT DISTINCT ?name ?description ?instanceType ?planet
      WHERE {
        ?planet rdfs:label ?name filter(lang(?name) = 'en').
        ?planet schema:description ?description filter(lang(?description) = 'en').
        ?planet wdt:P31 ?instanceType.
        VALUES ?instanceType {${listPlanetCodes
          .map((code) => `wd:${code}`)
          .join(" ")}}
        ${
          name !== ""
            ? `FILTER(CONTAINS(LCASE(?name), "${name.toLowerCase()}"))`
            : ""
        }      
      }
      GROUP BY ?name ?description ?instanceType ?planet
      ORDER BY ?name
      LIMIT 5
    `);
  return response.results?.bindings;
};

export const searchPlanetByIdWiki = async (id: string): Promise<any[]> => {
  const response = await executeWikiQuery(`
      SELECT DISTINCT 
        ?name
        ?mass 
        ?radius 
        ?distanceFromEarth
        ?density 
        ?orbitalPeriod 
        ?rotationalPeriod 
        ?escapeVelocity 
        ?axialTilt 
        ?meanTemperatureValue
        ?surfacePressureValue
        ?numberOfMoons 
        ?atmosphericComposition 
        ?parentAstronomicalBody 
        ?parentAstronomicalBodyLabel # Label for the parent astronomical body
        ?image
        ?gravitationalInfluence 
        ?albedo
        (COUNT(?naturalSatellite) AS ?numberOfNaturalSatellites) # Count of natural satellites
      WHERE {
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
        wd:${id} rdfs:label ?name filter (lang(?name) = "en").

        OPTIONAL { wd:${id} wdt:P2067 ?mass. }
        OPTIONAL { wd:${id} wdt:P2120 ?radius. }
        OPTIONAL { wd:${id} wdt:P2234 ?density. }
        OPTIONAL { wd:${id} wdt:P2583 ?distanceFromEarth. }

        OPTIONAL { wd:${id} wdt:P2244 ?orbitalPeriod. }
        OPTIONAL { wd:${id} wdt:P2146 ?rotationalPeriod. }
        OPTIONAL { wd:${id} wdt:P2228 ?escapeVelocity. }
        OPTIONAL { wd:${id} wdt:P2583 ?distanceFromSun. }
        OPTIONAL { wd:${id} wdt:P2235 ?axialTilt. }
        OPTIONAL { 
          wd:${id} p:P2076 ?meanTemperatureStatement.
          ?meanTemperatureStatement ps:P2076 ?meanTemperatureValue.
        }
        OPTIONAL { 
          wd:${id} p:P2044 ?surfacePressureStatement.
          ?surfacePressureStatement ps:P2044 ?surfacePressureValue.
        }
        OPTIONAL { wd:${id} wdt:P2114 ?atmosphericComposition. }
        OPTIONAL { wd:${id} wdt:P397 ?parentAstronomicalBody. 
                  ?parentAstronomicalBody rdfs:label ?parentAstronomicalBodyLabel filter (lang(?parentAstronomicalBodyLabel) = "en"). }
        OPTIONAL { wd:${id} wdt:P18 ?image. }
        OPTIONAL { wd:${id} wdt:P2229 ?gravitationalInfluence. }
        OPTIONAL { wd:${id} wdt:P2233 ?albedo. }
        OPTIONAL { wd:${id} wdt:P397 ?parentAstronomicalBody. }
        OPTIONAL { wd:${id} wdt:P398 ?naturalSatellite. }
        OPTIONAL { wd:${id} wdt:P376 ?numberOfMoons. }
      }
      GROUP BY ?name ?mass ?radius ?distanceFromEarth ?density ?orbitalPeriod ?rotationalPeriod ?escapeVelocity ?axialTilt ?meanTemperatureValue ?surfacePressureValue ?numberOfMoons ?atmosphericComposition ?parentAstronomicalBody ?parentAstronomicalBodyLabel ?image ?gravitationalInfluence ?albedo
      LIMIT 1
    `);
  return response.results?.bindings;
};

export const searchGalaxyByNameDBP = async (name: String): Promise<any[]> => {
  const resourceId = `:${name.replace(/ /g, "_")}`;
  const response = await executeQuery(`
        SELECT ?description ?image ?type ?stars ?wikipedia
        WHERE {
            ${resourceId} a dbo:Galaxy .
            ${resourceId} foaf:name ?name filter(lang(?name) = "en") .
            OPTIONAL {${resourceId} dbo:abstract ?description FILTER(LANG(?description) = 'en') .}
            OPTIONAL {${resourceId} dbo:thumbnail ?image .}
            OPTIONAL {${resourceId} dbo:type ?type .}
            OPTIONAL {${resourceId} dbo:stars ?stars .}
            OPTIONAL {${resourceId} dbo:isPrimaryTopicOf ?wikipedia .}
        }
        LIMIT 1
    `);
  return response.results?.bindings;
};

export const searchGalaxyByNameWiki = async (name: String): Promise<any[]> => {
  const response = await executeWikiQuery(`
      SELECT DISTINCT ?name ?description ?instanceType ?galaxy
      WHERE {
        ?galaxy rdfs:label ?name filter(lang(?name) = 'en').
        ?galaxy schema:description ?description filter(lang(?description) = 'en').
        ?galaxy wdt:P31 ?instanceType.
        VALUES ?instanceType {${listGalaxyCodes
          .map((code) => `wd:${code}`)
          .join(" ")}}
        ${
          name !== ""
            ? `FILTER(CONTAINS(LCASE(?name), "${name.toLowerCase()}"))`
            : ""
        }      
      }
      GROUP BY ?name ?description ?instanceType ?galaxy
      ORDER BY ?name
      LIMIT 5
    `);
  return response.results?.bindings;
};

export const searchGalaxyByIdWiki = async (id: string): Promise<any[]> => {
  const response = await executeWikiQuery(`
    SELECT DISTINCT 
        ?name
        ?mass 
        ?constellation #?constellationLabel
        ?childAstronomicalBody ?childAstronomicalBodyLabel 
        ?parentAstronomicalBody ?parentAstronomicalBodyLabel 
        ?rotationPeriod 
        ?galaxyMorphologicalType 
        ?absoluteMagnitude 
        ?radius 
        ?diameter 
        ?image
      WHERE {
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
        
        wd:${id} rdfs:label ?name filter(lang(?name) = "en") .

        OPTIONAL { wd:${id} wdt:P527 ?childAstronomicalBody. # Child astronomical bodies
                  ?childAstronomicalBody rdfs:label ?childAstronomicalBodyLabel. }
        OPTIONAL { wd:${id} wdt:P397 ?parentAstronomicalBody. # Parent astronomical body
                  ?parentAstronomicalBody rdfs:label ?parentAstronomicalBodyLabel filter (lang(?parentAstronomicalBodyLabel) = "en"). }
        OPTIONAL { wd:${id} wdt:P2067 ?mass. } # Mass
        OPTIONAL { wd:${id} wdt:P59 ?constellation. # Constellation
                  #?constellation rdfs:label ?constellationLabel. 
                }
        OPTIONAL { wd:${id} wdt:P2147 ?rotationPeriod. } # Rotation period
        OPTIONAL { wd:${id} wdt:P223 ?galaxyMorphologicalType. } # Galaxy morphological type
        OPTIONAL { wd:${id} wdt:P1457 ?absoluteMagnitude. } # Absolute magnitude
        OPTIONAL { wd:${id} wdt:P2120 ?radius. } # Radius
        OPTIONAL { wd:${id} wdt:P2386 ?diameter. } # Diameter
        OPTIONAL { wd:${id} wdt:P18 ?image. } # Image
      }
      LIMIT 1
    `);
  return response.results?.bindings;
};

export const searchStarByNameDBP = async (name: String): Promise<any[]> => {
  const resourceId = `:${name.replace(/ /g, "_")}`;
  const response = await executeQuery(`
  SELECT ?description ?image ?distance ?mass ?wikipedia
  WHERE {
      ${resourceId} a dbo:Star .
      OPTIONAL {${resourceId} foaf:name ?name filter (lang(?name) = "en").}
      OPTIONAL {${resourceId} dbo:abstract ?description FILTER(LANG(?description) = 'en') .}
      OPTIONAL {${resourceId} dbo:thumbnail ?image .}
      OPTIONAL {${resourceId} dbo:distance ?distance .}
      OPTIONAL {${resourceId} dbo:mass ?mass .}
      OPTIONAL {${resourceId} dbo:isPrimaryTopicOf ?wikipedia .}
  }
  LIMIT 1
`);
  return response.results?.bindings;
};

export const searchStarByNameWiki = async (
  name: String
): Promise<AxiosResponse> => {
  const response = await executeWikiQuery(`
      SELECT DISTINCT ?name ?description ?instanceType ?star
      WHERE {
        ?star rdfs:label ?name filter(lang(?name) = 'en').
        ?star schema:description ?description filter(lang(?description) = 'en') .
        ?star wdt:P31 ?instanceType.
        VALUES ?instanceType {${listStarCodes
          .map((code) => `wd:${code}`)
          .join(" ")}}
        ${
          name !== ""
            ? `FILTER(CONTAINS(LCASE(?name), "${name.toLowerCase()}"))`
            : ""
        } 
      }
      GROUP BY ?name ?description ?instanceType ?star
      ORDER BY ?name
      LIMIT 5
    `);
  return response.results?.bindings;
};

export const searchStarByIdWiki = async (id: String): Promise<any[]> => {
  const response = await executeWikiQuery(`
    SELECT DISTINCT ?name ?mass ?radius ?distanceFromEarth ?luminosity ?parentAstronomicalBody ?flattening ?spectralClass ?apparentMagnitude ?absoluteMagnitude ?metallicity ?density (SAMPLE(?temperatureValueCenter) AS ?temperatureCenter) (SAMPLE(?temperatureValuePhotosphere) AS ?temperaturePhotosphere) (SAMPLE(?temperatureValueCorona) AS ?temperatureCorona) (SAMPLE(?areaValue) AS ?area) ?volume ?perimeter ?astronomicSymbolImage ?depictedBy ?notation ?describedBySource
    WHERE {
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      wd:${id} rdfs:label ?name filter(lang(?name) = 'en') .
      OPTIONAL { wd:${id} wdt:P2067 ?mass. }
      OPTIONAL { wd:${id} wdt:P2120 ?radius. }
      OPTIONAL { wd:${id} wdt:P2583 ?distanceFromEarth. }
      OPTIONAL { wd:${id} wdt:P1102 ?flattening. }
      OPTIONAL { wd:${id} wdt:P215 ?spectralClass. }
      OPTIONAL { wd:${id} wdt:P2060 ?luminosity. }
      OPTIONAL { wd:${id} wdt:P1215 ?apparentMagnitude. }
      OPTIONAL { wd:${id} wdt:P1457 ?absoluteMagnitude. }
      OPTIONAL { wd:${id} wdt:P2227 ?metallicity. }
      OPTIONAL { wd:${id} wdt:P2054 ?density. }
      OPTIONAL {
        wd:${id} p:P2076 ?temperatureStatementCenter.
        ?temperatureStatementCenter ps:P2076 ?temperatureValueCenter.
        ?temperatureStatementCenter pq:P518 ?temperaturePartCenter.
        FILTER(?temperaturePartCenter = wd:Q23595)
      }
      OPTIONAL {
        wd:${id} p:P2076 ?temperatureStatementPhotosphere.
        ?temperatureStatementPhotosphere ps:P2076 ?temperatureValuePhotosphere.
        ?temperatureStatementPhotosphere pq:P518 ?temperaturePartPhotosphere.
        FILTER(?temperaturePartPhotosphere = wd:Q6372)
      }
      OPTIONAL {
        wd:${id} p:P2076 ?temperatureStatementCorona.
        ?temperatureStatementCorona ps:P2076 ?temperatureValueCorona.
        ?temperatureStatementCorona pq:P518 ?temperaturePartCorona.
        FILTER(?temperaturePartCorona = wd:Q170754)
      }
      OPTIONAL {
        wd:${id} p:P2046 ?areaStatement.
        ?areaStatement ps:P2046 ?areaValue.
      }
      OPTIONAL { wd:${id} wdt:P2234 ?volume. }
      OPTIONAL { wd:${id} wdt:P2547 ?perimeter. }
      OPTIONAL { wd:${id} wdt:P367 ?astronomicSymbolImage. }
      OPTIONAL { wd:${id} wdt:P398 ?childAstronomicalBody. }
      OPTIONAL { wd:${id} wdt:P397 ?parentAstronomicalBody. }
      OPTIONAL { wd:${id} wdt:P397 ?parentAstronomicalBody. 
        ?parentAstronomicalBody rdfs:label ?parentAstronomicalBodyLabel filter (lang(?parentAstronomicalBodyLabel) = "en"). }
      OPTIONAL { wd:${id} wdt:P18 ?image. }

    }
    GROUP BY ?name ?mass ?radius ?distanceFromEarth ?luminosity ?parentAstronomicalBody ?flattening ?spectralClass ?apparentMagnitude ?absoluteMagnitude ?metallicity ?density ?volume ?perimeter ?astronomicSymbolImage ?depictedBy ?notation ?describedBySource
    LIMIT 1
    `);
  return response.results?.bindings;
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

export const getType = async (id: String) => {
  const resourceId: String = `${id}`;
  try {
    const response = await executeWikiQuery(`
    SELECT DISTINCT 
      ?instanceType
    WHERE {
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }      
      wd:${resourceId} wdt:P31 ?instanceType
    }
    LIMIT 1
  `);
    const instanceType = response.results?.bindings[0].instanceType.value
      .split("/")
      .at(-1);
    if (listGalaxyCodes.includes(instanceType)) {
      return "galaxy";
    } else if (listPlanetCodes.includes(instanceType)) {
      return "planet";
    } else if (listStarCodes.includes(instanceType)) {
      return "star";
    } else {
      return "";
    }
  } catch (error) {
    console.error("Error fetching type:", error);
    return null;
  }
};
