import co from 'co';
import http from 'http';

const debug = require('debug')('generators:example');

// This function will return a promise that will fetch data from a certain URL

function getURLPromise(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (rs) => {
      var data = ''
      rs.on('data', (chunk) => data += chunk);
      rs.on('end', ()=>  resolve(data.length));
    });
  });
}

// Create our generator

function *myGen() {
  var a = yield getURLPromise('http://www.google.com')
  var b = yield getURLPromise('http://www.apple.com')
  var c = yield getURLPromise('http://www.microsoft.com')
  debug([a, b, c]);
}

// Instance of our generator

let gen = myGen();

// Function that will resolve our promise and pass on the result to the generator

function resolvePromise(gen, result) {
  gen.next(result).value.then(result => {
    resolvePromise(gen, result);
  });
}

// Start resolving promises

resolvePromise(gen, null);

// Let co.js handle all of the above in a neat fashion

co(function *() {
  // yield any promise
  var a = yield getURLPromise('http://www.google.com')
  var b = yield getURLPromise('http://www.apple.com')
  var c = yield getURLPromise('http://www.microsoft.com')

  debug([a, b, c]);
}).catch((error) =>{
  debug("Something went wrong: ", error)
});

