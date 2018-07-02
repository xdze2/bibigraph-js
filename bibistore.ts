/*
 Interface with the Crossref API

 - store the metadata

 */

import axios from 'axios';


let storage = {}
const PREFIX = 'doi_'

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




export function query(doi_list: string[]){
  /* Query the Crossref API for the given list of doi,
    and store the metadata in storage.
   */
  console.log(' -- query: ', doi_list.length )
  const MAILADRESS = 'bibigraph@mail.com'
  const USERAGENT = 'bibigraph project https://github.com/xdze2/bibigraph'


  doi_list = doi_list.map( x=>x.trim() )

  // Regex validation:
  const doi_pattern = /^10.\d{4,9}\/[-._;()\/:A-Z0-9]+$/i;

  const rejected_doi = doi_list.filter( doi => !doi_pattern.test(doi) )
  if(rejected_doi.length){
    console.log('pattern rejected doi:', rejected_doi)
  }

  doi_list = doi_list.filter( doi => doi_pattern.test(doi) )

  // Query:
  const concatenated_doi_list = doi_list.map( s=>`doi:${s}` ).join(',')

  const url = 'http://api.crossref.org/works'

  return axios.get(url, {
      params: {
        mailto: MAILADRESS,
        filter: concatenated_doi_list,
        rows:80
      },
      headers: { 'User-Agent': USERAGENT },
    })
    .then(function (response) {
      if(response.status == 200){

          const items =  response.data.message.items;
          console.log('response ', items.length)
          for (let metadata of items) {
            let doi = format_doi( metadata['DOI'] )
            storage[doi] =  metadata // not tracked by VueJS
          }

      } else {
          console.log('response error', response);
      }

    })

}
