import { load } from 'cheerio';

export type Options = {
  containClasses?: string | string[];
};

export type TableToJSON = (
  content: string,
  options?: Options
) => Promise<Record<string, string>[][]>;

/**
 * @param content - Extract table elements and return JSON structure
 * @param options - Options for the logic
 * @returns The JSON structure of tables content
 */

export const tableToJSON: TableToJSON = async (content, options) => {
  const $ = load(content);

  let additionalSelector: string = '';

  if (options?.containClasses instanceof Array) {
    additionalSelector = additionalSelector.concat(
      `.${options.containClasses.join('.')}`
    );
  } else {
    additionalSelector = options?.containClasses || '';
  }

  const response: Record<string, string>[][] = [];

  $(`table${additionalSelector}`).each((tableIndex, table) => {
    if (tableIndex !== 0) {
      return;
    }

    const columnHeaders: string[] = [];

    $(table)
      .find('thead tr th')
      .each((_headerCellIndex, headerCell) => {
        columnHeaders.push($(headerCell).text().trim());
      });

    const tableJson: Record<string, string>[] = [];

    $(table)
      .find('tbody tr')
      .each((_rowIndex, row) => {
        const rowJSON: Record<string, string> = {};
        $(row)
          .find('td')
          .each((cellIndex, cell) => {
            const cellValue = $(cell).text();
            if (cellValue == '\n') {
              return;
            }
            rowJSON[columnHeaders[cellIndex]] = cellValue.trim();
          });
        tableJson.push(rowJSON);
      });

    response.push(tableJson);
  });

  return response;
};
