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

const executeQuery = async (query: string) => {
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

const listPlanets = async (): Promise<AxiosResponse> => {
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

const searchPlanetByName = async (name: string): Promise<AxiosResponse> => {
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

const getInfosPlanet = async (name: string): Promise<AxiosResponse> => {
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

const listStars = async (): Promise<AxiosResponse> => {
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

const listGalaxies = async (): Promise<AxiosResponse> => {
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

export {
  listPlanets,
  searchPlanetByName,
  getInfosPlanet,
  listStars,
  listGalaxies,
};
