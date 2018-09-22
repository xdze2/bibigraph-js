import axios from "axios";


/**
 * Metadata object
 *
 * doc about the API format:
 * https://github.com/CrossRef/rest-api-doc/blob/master/api_format.md
 */
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
    /** Takes and parse the metadata from Crossref */
    this.data = metadata;
    this.title = (metadata["title"] || [""])[0];
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
        auth => `${auth["given"] || ""} ${auth["family"]}`
      );
      this.key = `${metadata["author"][0]["family"]}${this.year}`;
    } else {
      this.authors = [];
      this.key = this.doi;
    }
    this.citedby = [];
  }
}


/** --- Store --- */

interface IStorageType {
    [key: string]: Metadata;
}
const storage: IStorageType = {};

const PREFIX = "doi_";
// the prefix is added to the key  in the localstorage

/** Convert the doi to a key used in the storage */
function format_doi(doi: string): string {
  const key = doi.trim().toLowerCase();
  return `${PREFIX}${key}`;
}

/**
 * Main acces to the store
 * Returns the stored metadata or null if absent
 * @param list of doi
 * @return list of metadata object
 */
export function get(doilist: string[]): Array<undefined|Metadata> {
  //return doilist.map( (doi) => storage[format_doi(doi)] );
  return doilist.map( (doi) => storage[format_doi(doi)] );
}

/**
 * Go through all stored metadata
 * and fill the  citedby  field
 */
export function update_citedby(){
  const alldoi = Object.keys(storage).map( (key) => storage[key].doi );

  get(alldoi).forEach( (metadata) => {
    metadata.citedby = []
  })

  get(alldoi).forEach( (metadata) => {
    const doi = metadata.doi
    get(metadata.referenceWithDOI).forEach( (ref) => {
      if( ref ){
        ref.citedby.push(doi)
      }
    })
  });
}

/**
 * Return list of all stored doi
 * @return list of all stored doi
 */
export function alldoi(): string[]{
  return Object.keys(storage).map( (key) => storage[key].doi )
}

/**
 * Regex validation for a doi string
 * see: https://www.crossref.org/blog/dois-and-matching-regular-expressions/
 * @param string doi
 * @return bool
 */
export function isValidDOI( doi:string ):boolean {
  const doiPattern = /^10.\d{4,9}\/[-._;()\/:A-Z0-9]+$/i;
  return doiPattern.test(doi)
}

/** --- Query --- */

/**
 * Main access to the CrossRef api
 * perform the query
 * fill and update the local storage
 * @async
 * @param  doiList [description]
 * @return         [description]
 */
export function query(doilist: string[]){

  // filter out non valid doi
  doilist = doilist.filter(isValidDOI)

  const datapromise = query_crossref(doilist).then( (data) => {

    // Fill the storage:
    data.forEach( (metadata) => {storage[format_doi(metadata.doi)] = metadata} );
    // Update the storage:
    update_citedby()

    // Return the updated data
    // const actual_doilist = data.map( (metadata) => metadata.doi );
    return data;  // get(actual_doilist);
  })
  return datapromise;

}


// Config for the CrossRef API:
const MAILADRESS = "https://github.com/xdze2";
const USERAGENT = "bibigraph app https://github.com/xdze2/bibigraph";
const MAXQUERYSIZE = 16;
const URL = "https://api.crossref.org/works";

/**
 * Perform the request on the Crossref api
 * the number of doi is limited by  MAXQUERYSIZE
 * @async
 * @param  doiList list of doi
 * @return         list of Metadata object
 */
function query_crossref_chunk(doiList: string[]): Promise<Metadata[]> {
  console.log(`\u{1F4E1}  ${doiList.length} doi requested`);
  const concatenatedDoiList = doiList.map(s => `doi:${s}`).join(",");

  const querypromise = axios
    .get(URL, {
      params: {
        filter: concatenatedDoiList,
        mailto: MAILADRESS,
        rows: MAXQUERYSIZE
      },
      // headers: { "User-Agent": USERAGENT },
      responseType: "json"
    })
    .then((response) => {
      const items = response.data.message.items;
      return items.map(item => new Metadata(item));
    })
    .catch((error) => {
      console.log("<< query error !! >>");
      console.log(error.request);
      return [];
    });

  return querypromise;
}

/**
 * Perform the request on the Crossref api
 * same as query_crossref_chunk but
 * divide the doi list into chunk of size MAXQUERYSIZE
 * @async
 */
function query_crossref(doiList: string[]): Promise<Metadata[]> {
  // Divide the doi list in chunks:
  const n = doiList.length;
  const chunkList = [];
  for (let i = 0; i < n; i += MAXQUERYSIZE) {
    const chunk = doiList.slice(i, i + MAXQUERYSIZE);
    if (chunk.length > 0) {
      chunkList.push(chunk);
    }
  }

  // Queries:
  const allquery = chunkList.map(query_crossref_chunk);

  const mergedpromise = Promise.all(allquery).then(responsearray => {
    // concatenate
    return [].concat(...responsearray);
  });

  return mergedpromise;
}

// (( test )))
// query_crossref_chunk(['10.1103/physreva.51.1015', '10.1103//physrooe.51.101']).then( (rep) => {
//  console.log('rep ', rep)
// })
//
// const doi_list = [
//   "10.1109/50.4133",
//   "10.1103/physreva.38.1207",
//   "10.1088/0143-0807/18/5/011",
//   "10.1103/physrev.107.491",
//   "10.1109/tpas.1979.319501",
//   "10.1063/1.874118",
//   "10.1103/physreva.51.992",
//   "10.1016/j.vacuum.2010.02.005",
//   "10.1103/physrevlett.3.25",
//   "10.1103/physreva.52.3457",
//   "10.1103/physrevlett.79.325",
//   "10.1103/physrev.109.221",
//   "10.1063/1.456582",
//   "10.1098/rspa.1985.0070",
//   "10.1103/physreva.57.120",
//   "10.1002/pssb.2220620205",
//   "10.1103/physrev.104.1223",
//   "10.1007/s004600050353",
//   "10.1016/s0925-4005(98)00215-9",
//   "10.1063/1.1288407",
//   "10.1109/27.902240",
//   "10.1016/j.optlaseng.2009.08.011",
//   "10.1103/physrevlett.74.4087",
//   "10.1016/s0925-4005(04)00415-0",
//   "10.1103/physrev.101.944",
//   "10.1103/physrevlett.79.2371",
//   "10.1143/jjap.47.8928",
//   "10.1016/s0167-2789(98)00046-3",
//   "10.1103/physrev.114.1245",
//   "10.1016/b978-0-08-020574-8.50007-9",
//   "10.1098/rspa.1992.0167",
//   "10.1103/physrev.106.489",
//   "10.1109/tpas.1981.316530",
//   "10.1063/1.3501022",
//   "10.1006/spmi.1997.0562",
//   "10.1103/physrev.95.844",
//   "10.1088/0963-0252/16/3/025",
//   "10.1126/science.275.5298.350",
//   "10.1103/physrev.124.1068",
//   "10.1109/tei.1979.298157",
//   "10.1103/physreva.62.012306",
//   "10.1126/science.261.5128.1569",
//   "10.1109/tei.1980.298335",
//   "10.1103/physrevlett.1.368",
//   "10.1109/tdei.2009.5211869",
//   "10.1103/physrev.98.915",
//   "10.1016/1044-0305(93)85050-8",
//   "10.1063/1.1678569",
//   "10.1063/1.1696957",
//   "10.1007/bf02650179",
//   "10.1103/physrev.118.1523",
//   "10.1103/physrevlett.74.4083",
//   "10.1098/rspa.1989.0099",
//   "10.1103/physrev.118.1534",
//   "10.1016/1044-0305(91)80038-9",
//   "10.1143/jpsj.33.730",
//   "10.1103/physrev.70.460",
//   "10.1103/physrev.134.a265",
//   "10.1103/physrevlett.75.4710",
//   "10.1103/physrevlett.17.847",
//   "10.1109/tpas.1974.294024",
//   "10.1049/ip-d.1980.0048",
//   "10.1103/physreva.51.1015",
//   "10.1143/jpsj.43.1262",
//   "10.1109/tdei.2009.4784550",
//   "10.1038/30156",
//   "10.1103/physrevlett.1.275",
//   "10.1080/00107519608217543",
//   "10.1098/rspa.1998.0167",
//   "10.4313/teem.2006.7.4.204",
//   "10.1103/physrevlett.75.4714",
//   "10.1103/physrevb.24.4714",
//   "10.1109/tpwrd.2007.899273",
//   "10.1063/1.433534",
//   "10.1080/00018738900101122",
//   "10.1109/tdei.2007.344607",
//   "10.1103/physrev.73.679",
//   "10.1063/1.1721449",
//   "10.1103/physrevlett.74.4091",
//   "10.1103/physreva.52.r2493",
//   "10.1103/physrev.114.1219",
//   "10.1103/physrev.97.1721",
//   "10.1103/physreva.57.r1",
//   "10.1103/physrevlett.62.2124",
//   "10.1016///j.cap.2006.09.022"
// ];
//
// console.log("nbr doi", doi_list.length);
//
// query_crossref(doi_list).then(rep => {
//   console.log("rep ", rep.length);
// });
