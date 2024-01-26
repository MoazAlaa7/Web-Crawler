const { sortPages } = require("./report");
const { test, expect } = require("@jest/globals");

test("sortPages", () => {
  const input = {
    "https://google.com/path": 1,
    "https://google.com": 3,
    "https://google.com/path1": 2,
  };
  const actual = sortPages(input);
  const expected = [
    ["https://google.com", 3],
    ["https://google.com/path1", 2],
    ["https://google.com/path", 1],
  ];
  expect(actual).toEqual(expected);
});
