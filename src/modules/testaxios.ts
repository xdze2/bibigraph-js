
import axios from 'axios';


const mail_adress = 'bibigraph@gmail.com';


const url = 'http://api.crossref.org/works?sample=20&select=DOI,title';
  // const url = 'https://jsonplaceholder.typicode.com/posts'
axios.get(url, {
      headers: { 'User-Agent': 'bibigraph project https://github.com/xdze2/bibigraph' },
    })
    .then(function(response) {
          console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });
