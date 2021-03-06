
import * as bibistore from  './bibistore';

console.log('>> bibistore test')

//import { expect } from 'chai';
//import 'mocha';

/*describe('Hello function', () => {

  it('should return hello world', () => {
    const result = hello();
    expect(result).to.equal('Hello world!');
  });

});*/



//const doi_list = ['10.1109/TDEI.2009.5211869', '10.1109/TPAS.1981.316530']


const doi_list = ['10.1109/50.4133', '10.1103/physreva.38.1207', '10.1088/0143-0807/18/5/011',
'10.1103/physrev.107.491', '10.1109/tpas.1979.319501', '10.1063/1.874118', '10.1103/physreva.51.992',
'10.1016/j.vacuum.2010.02.005', '10.1103/physrevlett.3.25', '10.1103/physreva.52.3457',
'10.1103/physrevlett.79.325', '10.1103/physrev.109.221', '10.1063/1.456582', '10.1098/rspa.1985.0070',
'10.1103/physreva.57.120', '10.1002/pssb.2220620205', '10.1103/physrev.104.1223', '10.1007/s004600050353',
'10.1016/s0925-4005(98)00215-9', '10.1063/1.1288407', '10.1109/27.902240', '10.1016/j.optlaseng.2009.08.011', '10.1103/physrevlett.74.4087', '10.1016/s0925-4005(04)00415-0', '10.1103/physrev.101.944', '10.1103/physrevlett.79.2371', '10.1143/jjap.47.8928', '10.1016/s0167-2789(98)00046-3', '10.1103/physrev.114.1245', '10.1016/b978-0-08-020574-8.50007-9', '10.1098/rspa.1992.0167', '10.1103/physrev.106.489', '10.1109/tpas.1981.316530', '10.1063/1.3501022', '10.1006/spmi.1997.0562', '10.1103/physrev.95.844', '10.1088/0963-0252/16/3/025', '10.1126/science.275.5298.350',
'10.1103/physrev.124.1068', '10.1109/tei.1979.298157', '10.1103/physreva.62.012306',
'10.1126/science.261.5128.1569', '10.1109/tei.1980.298335', '10.1103/physrevlett.1.368',
'10.1109/tdei.2009.5211869', '10.1103/physrev.98.915', '10.1016/1044-0305(93)85050-8',
'10.1063/1.1678569', '10.1063/1.1696957', '10.1007/bf02650179', '10.1103/physrev.118.1523',
'10.1103/physrevlett.74.4083', '10.1098/rspa.1989.0099', '10.1103/physrev.118.1534',
'10.1016/1044-0305(91)80038-9', '10.1143/jpsj.33.730', '10.1103/physrev.70.460',
'10.1103/physrev.134.a265', '10.1103/physrevlett.75.4710', '10.1103/physrevlett.17.847',
'10.1109/tpas.1974.294024', '10.1049/ip-d.1980.0048',
'10.1103/physreva.51.1015', '10.1143/jpsj.43.1262', '10.1109/tdei.2009.4784550',
'10.1038/30156', '10.1103/physrevlett.1.275', '10.1080/00107519608217543',
'10.1098/rspa.1998.0167', '10.4313/teem.2006.7.4.204', '10.1103/physrevlett.75.4714',
'10.1103/physrevb.24.4714', '10.1109/tpwrd.2007.899273', '10.1063/1.433534',
'10.1080/00018738900101122', '10.1109/tdei.2007.344607', '10.1103/physrev.73.679',
'10.1063/1.1721449', '10.1103/physrevlett.74.4091', '10.1103/physreva.52.r2493',
'10.1103/physrev.114.1219', '10.1103/physrev.97.1721', '10.1103/physreva.57.r1',
'10.1103/physrevlett.62.2124', '10.1016/j.cap.2006.09.022']

console.log("doi list, lenght:", doi_list.length)

const shortdoilist =  ['10.1103/physreva.51.1015', '10.1143/jpsj.43.1262', '10.1109/tdei.2009.4784550',
'10.1038/30156', '10.1103/physrevlett.1.275', '10.1080/00107519608217543',
'10.1098/rspa.1998.0167', '10.4313/teem.2006.7.4.204', '10.1103/physrevlett.75.4714',
'10.1103/physrevb.24.4714', '10.1109/tpwrd.2007.899273', '10.1063/1.433534',
'10.1080/00018738900101122', '10.1109/tdei.2007.344607', '10.1103/physrev.73.679',
'10.1063/1.1721449', '10.1103/physrevlett.74.4091', '10.1103/physreva.52.r2493',
'10.1103/physrev.114.1219', '10.1103/physrev.97.1721', '10.1103/physreva.57.r1',
'10.1103/physrevlett.62.2124', '10.1016/j.cap.2006.09.022']

console.log("short doi list, lenght:", shortdoilist.length)

//console.log('get a doi', bibistore.get(['10.1103/physrev.114.1219']) )

console.log('query a doi', bibistore.query(shortdoilist)
  .then( (rep) => { console.log(rep)} )
)


/*
bibistore.query( shortdoilist )
  .then( data => console.log( data.length ))
  .catch(err=>console.log(err))
*/
/*
bibistore.getmany(shortdoilist)
  .then( x=>console.log( 'query short', x.length ) )
  .then( x=> {
      bibistore.getmany(doi_list)
        .then( u=>console.log( 'query long', u.length ) )
  })


bibistore.getmany([])
  .then( x=>console.log( 'empty query', x ) )
*/
