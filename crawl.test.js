const { normalizeURL, getURLsFromHTML } = require("./crawl.js");
const { test, expect } = require("@jest/globals");

test("normalizeURL strip protocol", () => {
  const input = "https://google.com/path";
  const actual = normalizeURL(input);
  const expected = "google.com/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL strip trailing slash", () => {
  const input = "http://google.com/path/";
  const actual = normalizeURL(input);
  const expected = "google.com/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL Decapitalize", () => {
  const input = "http://GOOGLE.com/path/";
  const actual = normalizeURL(input);
  const expected = "google.com/path";
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML absolute", () => {
  const inputHTMLBody = `
  <html>
    <body>
      <a href = "http://google.com/path/">
        google
      </a>
    </body>
  </html>
  `;
  const inputBaseURL = "http://google.com";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["http://google.com/path/"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML relative", () => {
  const inputHTMLBody = `
  <html>
    <body>
      <a href = "/path/">
        google
      </a>
    </body>
  </html>
  `;
  const inputBaseURL = "http://google.com";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["http://google.com/path/"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML both", () => {
  const inputHTMLBody = `
  <html>
    <body>
      <a href = "http://google.com/">
        google
      </a>
      <a href = "/path/">
        google/path
      </a>
    </body>
  </html>
  `;
  const inputBaseURL = "http://google.com";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["http://google.com/", "http://google.com/path/"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML invaled", () => {
  const inputHTMLBody = `
  <html>
    <body>
      <a href = "invaled">
        google
      </a>
    </body>
  </html>
  `;
  const inputBaseURL = "http://google.com";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [];
  expect(actual).toEqual(expected);
});
