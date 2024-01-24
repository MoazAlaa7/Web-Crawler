const { normalizeURL } = require("./crawl.js");
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
