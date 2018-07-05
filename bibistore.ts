/*
 Interface with the Crossref API

 - store the metadata

 */

import axios from "axios";

//
// Storage
//

interface IStorageType {
    [key: string]: object;
}

const storage: IStorageType = {};

const PREFIX = "doi_"; // the prefix is added to the key

function format_doi(doi: string) {
  /* Convert the doi to a key used in the storage */
  const key = doi.trim().toLowerCase();
  return `${PREFIX}${key}`;
}

export function get(doi: string): object | undefined {
  /* Return the stored metadata or null */
  return storage[format_doi(doi)];
}

export function getmany(doiList: string[]) {
  /* async, return the metadata for the asked doi
  *  perform the query for the missing metadata
  *  update the storage
  */

  // Sort missing doi from the already obtain doi:
  function findmissing(
    missingandpresent: { missing: string[]; present: object[] },
    doi: string,
  ) {
    const metadata = get(doi);
    if (metadata) {
      missingandpresent.present.push(metadata);
    } else {
      missingandpresent.missing.push(doi);
    }
    return missingandpresent;
  }
  const { missing, present } = doiList.reduce(findmissing, {
    missing: [],
    present: [],
  });

  function updatestorageandconcatenate(data: object[]) {
    data.forEach( (metadata: object) => {storage[format_doi(metadata["DOI"])] = metadata} );
    return present.push(...data);
  }

  // Return the concatenated Promise of data:
  return query(missing).then(updatestorageandconcatenate);
}

//
// Query
//
const MAILADRESS = "bibigraph@mail.com";
const USERAGENT = "bibigraph project https://github.com/xdze2/bibigraph";
const MAXQUERYSIZE = 16;
const url = "http://api.crossref.org/works";

function query(doiList: string[]) {
  /*  Query the Crossref API for the given list of doi,
   *  and store the metadata in storage.
  */
  console.log(" -- query: ", doiList.length);

  // doi parsing & Regex validation:
  doiList = doiList.map( (x) => x.trim());
  const doiPattern = /^10.\d{4,9}\/[-._;()\/:A-Z0-9]+$/i;

  const rejectedDoi = doiList.filter( (doi) => !doiPattern.test(doi));
  if (rejectedDoi.length) {
    console.log("pattern rejected doi:", rejectedDoi);
  }

  doiList = doiList.filter( (doi) => doiPattern.test(doi));

  // TODO: with empty chunk to...
  if( doiList.length==0 ){
      return Promise.resolve([])
  }

  // Divide the doi list in chunk:
  const n = doiList.length;
  const chunkList = [];
  for (let i = 0; i < n; i += MAXQUERYSIZE) {
    const chunk = doiList.slice(i, i + MAXQUERYSIZE);
    chunkList.push(chunk);
  }

  // Query:
  const allquery = chunkList.map( (chunk) => {
    const concatenatedDoiList = chunk.map( (s) => `doi:${s}`).join(",");
    const querypromise = axios.get(url, {
      headers: { "User-Agent": USERAGENT },
      params: {
        filter: concatenatedDoiList,
        mailto: MAILADRESS,
        rows: MAXQUERYSIZE,
      },
    });
    return querypromise;
  });

  const mergedpromise = Promise.all(allquery).then( (responsearray) => {
    const data = [];
    for (const response of responsearray) {
      if (response.status === 200) {
        const items = response.data.message.items;
        data.push(...items);
      } else {
        console.log("response error", response);
      }
    }
    return data;
  });

  return mergedpromise;
}
