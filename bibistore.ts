/*
 Interface with the Crossref API
 and store locally the metadata
 */

import axios from 'axios';


let storage = {}

function format_doi(doi){
  /* Convert the doi to a key used in the localStorage */
  const key = doi.trim().toLowerCase()
  return `doi_${key}`
}

export function get(doi){
  /* Return the stored metadata or null */
  doi = format_doi(doi);
  return storage[doi] //localStorage.getItem( doi );
}

export function stored_doi_list(){
  /* Return the list of doi */
  let key_list = Object.keys( storage )
  key_list = key_list.filter( x=>x.startsWith('doi_') )
  return key_list.map( x=>x.replace("doi_", "") )
}



export function query(doi_list){
  /* Query the Crossref API for the given list of doi,
    and store the metadata in the localStorage.
   */
  const mail_adress = 'bibigraph';

  console.log('- bibistore query -');

  doi_list = doi_list.map( x=>x.trim() )

  // Regex validation:
  const doi_pattern = /^10.\d{4,9}\/[-._;()\/:A-Z0-9]+$/i;

  const rejected_doi = doi_list.filter( doi => !doi_pattern.test(doi) )
  console.log('rejected doi:')
  console.log(rejected_doi)

  doi_list = doi_list.filter( doi => doi_pattern.test(doi) )

  // Query:
  const concatenated_doi_list = doi_list.map( s=>`doi:${s}` ).join(',')

  const url = 'http://api.crossref.org/works'

  axios.get(url, {
      params: {
        mailto: mail_adress,
        filter: concatenated_doi_list,
        rows:40
      }
    })
    .then(function (response) {
      if(response.status == 200){
          const items =  response.data.message.items;

          for (let metadata of items) {
            // add the metadata to local storage:
            let doi = format_doi( metadata['DOI'] )
            //localStorage.setItem(doi, JSON.stringify(metadata));
            storage[doi] =  metadata
            console.log(`${doi} added`)
          }

      } else {
          console.log(response);
      }
    })
    .catch(function (error) {
      console.log(error);
    });

}
