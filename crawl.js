const { JSDOM } = require("jsdom");

async function crawlPage(baseURL, currentURL, pages) {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);

  if (currentURLObj.hostname !== baseURLObj.hostname) {
    return pages;
  }

  const nomalizedCurrentURL = normalizeURL(currentURL);
  if (pages[nomalizedCurrentURL] > 0) {
    pages[nomalizedCurrentURL]++;
    return pages;
  }

  pages[nomalizedCurrentURL] = 1;

  console.log(`Crawling ${currentURL}...`);
  let htmlBody = "";
  try {
    const resp = await fetch(currentURL);

    if (resp.status > 399) {
      console.log(
        `HTTP error, status code: ${resp.status}, on page: ${currentURL}`
      );
      return pages;
    }

    const contentType = resp.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(
        `Error, non-html response: ${contentType}, on page: ${currentURL}`
      );
      return pages;
    }

    htmlBody = await resp.text();
  } catch (err) {
    console.log(`Error: ${err.message}, on page: ${currentURL}`);
  }

  const nextURLs = getURLsFromHTML(htmlBody, baseURL);
  for (const nextURL of nextURLs) {
    pages = await crawlPage(baseURL, nextURL, pages);
  }

  return pages;
}

function getURLsFromHTML(htmlBody, baseURl) {
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  const urls = [];
  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === "/") {
      try {
        const urlObj = new URL(`${baseURl}${linkElement.href}`);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`Error: ${err.message}`);
      }
    } else {
      try {
        const urlObj = new URL(linkElement.href);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`Error: ${err.message}`);
      }
    }
  }
  return urls;
}

function normalizeURL(urlString) {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}
module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
