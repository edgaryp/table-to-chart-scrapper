import puppeteer from 'puppeteer';
import { tableToJSON } from './tableToJson';

const urls: string[] = [
  'https://en.wikipedia.org/wiki/Women%27s_high_jump_world_record_progression',
  'https://en.wikipedia.org/wiki/States_and_territories_of_Australia',
];

const getPageContent = async (url: URL): Promise<string> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url.href);
  return await page.content();
};

(async () => {
  const content = await getPageContent(new URL(urls[1]));
  const table = await tableToJSON(content, {
    containClasses: ['wikitable', 'sortable'],
  });
  console.log(table);
})();
