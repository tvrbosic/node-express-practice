const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const fillTemplateData = require('./modules/fillTemplateData');

const overviewTemplate = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const productTemplate = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const cardTemplate = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/assets/json/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

// For demonstration - NOT NEEDED
const slugs = dataObject.map((element) => slugify(element.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const productCardsHtml = dataObject
      .map((element) => fillTemplateData(cardTemplate, element))
      .join('');
    const output = overviewTemplate.replace('{%PRODUCT_CARDS%}', productCardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    const product = dataObject[query.id];
    const output = fillTemplateData(productTemplate, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'Hello world!',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
