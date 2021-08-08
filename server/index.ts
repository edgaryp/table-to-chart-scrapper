import puppeteer from 'puppeteer';
import { tablesToJSON } from './tableToJson';
import { GenerateChart } from './generateChart';

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
  const tablesData = await tablesToJSON(content, {
    containClasses: ['wikitable', 'sortable'],
  });
  tablesData.forEach(async (tableData) => {
    const generateChart = new GenerateChart(tableData);
    try {
      console.log('generateChart', await generateChart.getChart());
    } catch (error) {
      console.log(error);
    }
  });
})();
