
var x = false;
var test = new Promise( (resolve, reject) => {
   if(x) {
      resolve('x is true');
   }
   else{
      reject('x is false');
   }
});


var hello = () => {
   return test.then((x) => {
      console.log('Promise?');
   })
   .then( () => {
      console.log('Hi there');
   });
};

beforeEach(hello);

describe('Im figuring this out', () => {
   it('Should do what I say', () => {
      console.log('run the beforeEach function');
   });
});
console.log('Did that just run?');