
import * as bibistore from  './bibistore';
// import { expect } from 'chai';
// import 'mocha';

/*describe('Hello function', () => {

  it('should return hello world', () => {
    const result = hello();
    expect(result).to.equal('Hello world!');
  });

});*/



const doi_list = ['10.1109/TDEI.2009.5211869', '10.1109/TPAS.1981.316530'];

bibistore.query( doi_list ).then( (x) =>  console.log( bibistore.stored_doi_list() ),
);
