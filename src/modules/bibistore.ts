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
  doi: string;
  reference?: {
    DOI?: string;
  }[];
}

// apiformat: https://github.com/CrossRef/rest-api-doc/blob/master/api_format.md
class Metadata {
  doi: string;
  title: string;
  year: number;
  journal: string;
  reference: string[];
  referenceWithDOI: string[];
  citedbycount: number;
  referencescount: number;
  url: string;
  data: {};
  key: string;
  authors: string[];
  citedby: string[];

  constructor(metadata) {
    /* Take the metadata from Crossref */
    this.data = metadata;
    this.title = (metadata["title"] || [''])[0];
    this.year = metadata["issued"]["date-parts"][0][0];
    this.citedbycount = metadata["is-referenced-by-count"];
    this.referencescount = metadata["references-count"];
    this.url = metadata["URL"];
    this.doi = metadata["DOI"];
    this.journal = metadata["container-title"][0] || "";

    if (metadata["reference"]) {
      this.referenceWithDOI = metadata["reference"]
        .filter(ref => ref["DOI"])
        .map(ref => ref["DOI"]);
      this.reference = metadata["reference"];
    } else {
      this.reference = [];
      this.referenceWithDOI = [];
    }

    if (metadata["author"]) {
      this.authors = metadata["author"].map(
        auth => `${auth["given"]||''} ${auth["family"]}`
      );
      this.key = `${metadata["author"][0]["family"]}${this.year}`;
    } else {
      this.authors = [];
      this.key = this.doi;
    }
    this.citedby = [];
  }
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

export function getall_doi(): string[]{
  return Object.keys(storage).map( (key) => storage[key].doi )
}

export function update_citedby(){
  const alldoi = getall_doi()

  for ( const doi of alldoi ){
    const metadata = get(doi)
    metadata.citedby = []
  };
  for ( const doi of alldoi ){
    const refs = get(doi).referenceWithDOI
      for(const ref of refs){
        const metadata = get(ref)
        if( metadata ){
          metadata.citedby.push(doi)
        }
      }
  };
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
    data.forEach( (metadata) => {storage[format_doi(metadata.doi)] = metadata} );
    present.push(...data)
    update_citedby()
    return present;
  }

  // Return the concatenated Promise of data:
  return query(missing).then(updatestorageandconcatenate);
}

export function isValidDOI( doi ){
  /* Regex validation for doi
  see: https://www.crossref.org/blog/dois-and-matching-regular-expressions/
  */
  const doiPattern = /^10.\d{4,9}\/[-._;()\/:A-Z0-9]+$/i;
  return doiPattern.test(doi)
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


  const rejectedDoi = doiList.filter( (doi) => !isValidDOI(doi));
  if (rejectedDoi.length) {
    console.log("pattern rejected doi:", rejectedDoi);
  }

  doiList = doiList.filter( (doi) => isValidDOI(doi) );

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
    return data.map( (item) => new Metadata(item) );
  })//.catch( (error) => console.log(error) );

  return mergedpromise;
}
