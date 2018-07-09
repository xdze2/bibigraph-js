/*
 Interface with the Crossref API

 - store the metadata

 */

import axios from "axios";

//
// Storage
//
//
export interface IMetadata {
  DOI: string;
  reference?: {
    DOI?: string;
  }[];
}

interface IStorageType {
    [key: string]: IMetadata;
}

const storage: IStorageType = {};

const PREFIX = "doi_"; // the prefix is added to the key

function format_doi(doi: string) {
  /* Convert the doi to a key used in the storage */
  const key = doi.trim().toLowerCase();
  return `${PREFIX}${key}`;
}

export function get(doi: string): IMetadata | undefined {
  /* Return the stored metadata or null */
  return storage[format_doi(doi)];
}

export function getmany(doiList: string[]) {
  /* async, return the metadata for the asked doi
  *  perform the query for the missing metadata
  *  update the storage
  *
  *  Return an Array of metadata object
  */

  // Sort missing doi from the already obtain doi:
  function findmissing(
    missingandpresent: { missing: string[]; present: IMetadata[]; },
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

  function updatestorageandconcatenate(data: IMetadata[]) {
    data.forEach( (metadata) => {storage[format_doi(metadata["DOI"])] = metadata} );
    present.push(...data)
    return present;
  }

  // Return the concatenated Promise of data:
  return query(missing).then(updatestorageandconcatenate);
}

//
// Query
//
const MAILADRESS = "https://github.com/xdze2";
const USERAGENT = "bibigraph app https://github.com/xdze2/bibigraph";
const MAXQUERYSIZE = 16;
const url = "https://api.crossref.org/works";

function query(doiList: string[]) {
  /*  Query the Crossref API for the given list of doi,
   *  and store the metadata in storage.
  */

  // doi parsing & Regex validation:
  doiList = doiList.map( (x) => x.trim());
  const doiPattern = /^10.\d{4,9}\/[-._;()\/:A-Z0-9]+$/i;

  const rejectedDoi = doiList.filter( (doi) => !doiPattern.test(doi));
  if (rejectedDoi.length) {
    console.log("pattern rejected doi:", rejectedDoi);
  }

  doiList = doiList.filter( (doi) => doiPattern.test(doi) );

  if( doiList.length==0 ){
      return Promise.resolve( [] )
  }

  // Divide the doi list in chunk:
  const n = doiList.length;
  const chunkList = [];
  for (let i = 0; i < n; i += MAXQUERYSIZE) {
    const chunk = doiList.slice(i, i + MAXQUERYSIZE);
    if(chunk.length>0) { chunkList.push(chunk) };
  }

  // Query:
  const allquery = chunkList.map( (chunk) => {
    console.log(`\u{1F4E1}  ${chunk.length} doi requested`);
    const concatenatedDoiList = chunk.map( (s) => `doi:${s}`).join(",");
    const querypromise = axios.get(url, {
      params: {
        filter: concatenatedDoiList,
        mailto: MAILADRESS,
        rows: MAXQUERYSIZE,
      },
    });
    return querypromise;
  });

  const mergedpromise = Promise.all(allquery).then( (responsearray) => {
    const data: IMetadata[] = [];
    for (const response of responsearray) {
      if (response.status === 200) {
        const items = <IMetadata[]>response.data.message.items;
        data.push(...items);
      } else {
        console.log("response error", response);
      }
    }
    return data;
  })//.catch( (error) => console.log(error) );

  return mergedpromise;
}



export function getkey(doi: string){
  /* Return  the bibliographic key: AuthorYEAR
   */
  const metadata = get(doi)
  if(metadata){


  }
  else{
    return doi
  }

}
