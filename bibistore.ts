/*
 Interface with the Crossref API

 - store the metadata

 */

import axios from 'axios';

const PREFIX = 'doi_'

let storage = {}


function format_doi(doi){
  /* Convert the doi to a key used in the storage */
  const key = doi.trim().toLowerCase()
  return `${PREFIX}${key}`
}

export function get(doi){
  /* Return the stored metadata or null */
  return storage[ format_doi(doi) ]
}

export function stored_doi_list(){
  /* Return the list of doi */
  let key_list = Object.keys( storage )
  key_list = key_list.filter( x=>x.startsWith(PREFIX) )
  return key_list.map( x=>x.replace(PREFIX, "") )
}

const MAILADRESS = 'bibigraph@mail.com'
const USERAGENT = 'bibigraph project https://github.com/xdze2/bibigraph'
const MAXQUERYSIZE = 16
const url = 'http://api.crossref.org/works'

export function query(doi_list: string[]){
  /*  Query the Crossref API for the given list of doi,
   *  and store the metadata in storage.
   */
  console.log(' -- query: ', doi_list.length )

  // doi parsing & Regex validation:
  doi_list = doi_list.map( x=>x.trim() )
  const doi_pattern = /^10.\d{4,9}\/[-._;()\/:A-Z0-9]+$/i;

  const rejected_doi = doi_list.filter( doi => !doi_pattern.test(doi) )
  if(rejected_doi.length){
    console.log('pattern rejected doi:', rejected_doi)
  }

  doi_list = doi_list.filter( doi => doi_pattern.test(doi) )

  // Divide the doi list in chunk:
  const n = doi_list.length
  let chunk_list = []
  for (let i=0; i<n; i+=MAXQUERYSIZE) {
      let chunk = doi_list.slice(i, i+MAXQUERYSIZE);
      chunk_list.push(chunk)
  }

  // Query:
  const allquery = chunk_list.map( function(chunk){

    const concatenated_doi_list = chunk.map( s=>`doi:${s}` ).join(',')
    const querypromise = axios.get(url, {
      params: {
        mailto: MAILADRESS,
        filter: concatenated_doi_list,
        rows: MAXQUERYSIZE
      },
      headers: { 'User-Agent': USERAGENT },
    })
    return querypromise
  })

  const mergedpromise = Promise.all(allquery).then(function(responsearray) {
    let data = []
    for (let response of responsearray){
      if(response.status == 200){
        const items =  response.data.message.items;
        data.push( ...items )
      }
      else {
          console.log('response error', response);
      }
    }
    return data
    })

  return mergedpromise
}
