import { load } from 'cheerio';

export type Options = {
  containClasses?: string | string[];
};

export type TableData = Record<string, string>[];

export type TablesToJSON = (
  content: string,
  options?: Options
) => Promise<TableData[]>;

/**
 * @param content - Extract table elements and return JSON structure
 * @param options - Options for the logic
 * @returns The JSON structure of tables content
 */
export const tablesToJSON: TablesToJSON = async (content, options) => {
  const $ = load(content);

  let additionalSelector: string = '';

  if (options?.containClasses instanceof Array) {
    additionalSelector = additionalSelector.concat(
      `.${options.containClasses.join('.')}`
    );
  } else {
    additionalSelector = options?.containClasses || '';
  }

  const response: TableData[] = [];

  $(`table${additionalSelector}`).each((_tableIndex, table) => {
    const columnHeaders: string[] = [];

    $(table)
      .find('thead tr th')
      .each((_headerCellIndex, headerCell) => {
        columnHeaders.push($(headerCell).text().trim());
      });

    const tableJson: TableData = [];

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
