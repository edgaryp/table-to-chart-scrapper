import {
  ChartJSNodeCanvas,
  ChartJSNodeCanvasOptions,
} from 'chartjs-node-canvas';
import {
  PluginServiceRegistrationOptions,
  ChartData,
  ChartDataSets,
} from 'chart.js';
import { TableData } from './tableToJson';

export type Options = {
  chartJSNodeCanvasOptions: ChartJSNodeCanvasOptions;
};

/**
 * Creates chart from Chart.js.
 *
 * @class GenerateChart
 */
export class GenerateChart {
  private chartJSNodeCanvas: ChartJSNodeCanvas;
  private chartData: ChartData | undefined;

  /**
   * Creates an instance of GenerateChart.
   *
   * @param {TableData} tableData
   * @param {Options} [options={
   *       chartJSNodeCanvasOptions: {
   *         type: 'svg',
   *         width: 2000,
   *         height: 1000,
   *       },
   *     }]
   * @memberof GenerateChart
   */
  constructor(
    tableData: TableData,
    options: Options = {
      chartJSNodeCanvasOptions: {
        type: 'svg',
        width: 2000,
        height: 1000,
      },
    }
  ) {
    this.chartJSNodeCanvas = new ChartJSNodeCanvas(
      options.chartJSNodeCanvasOptions
    );
    this.chartData = this.convertTableDataToChartData(tableData);
  }

  /**
   * Converts table date into data structure that Chat.js accepts.
   *
   * @private
   * @param {TableData} tableData
   * @return {*}  {(ChartData | undefined)}
   * @memberof GenerateChart
   */
  private convertTableDataToChartData(
    tableData: TableData
  ): ChartData | undefined {
    const chartData: {
      labels: string[];
      datasets: { data: number[] }[];
    } = {
      labels: [],
      datasets: [],
    };

    /**
     * Exclude non-numeric column
     */
    tableData.forEach((row) => {
      for (const property in row) {
        if (Number(row[property]) && !chartData?.labels.includes(property)) {
          chartData.labels.push(property);
        }
      }
    });

    if (chartData.labels.length <= 0) {
      return;
    }

    tableData.forEach((row, rowIndex) => {
      chartData.datasets.push({ data: [] });
      chartData.labels.forEach((label) => {
        chartData.datasets[rowIndex].data.push(
          parseFloat(row[label].replace(/,/g, ''))
        );
      });
    });

    return chartData;
  }

  /**
   * Non-numeric column will be excluded, this means if the table doesn't have any numeric column, reject will be returned
   *
   * @return {Promise<Buffer>}
   * @memberof GenerateChart
   */
  public async getChart(): Promise<Buffer> {
    if (!this.chartData) {
      throw 'No validate table date for chart';
    }
    const plugin: PluginServiceRegistrationOptions = {
      beforeDraw: ({ canvas, width, height }) => {
        const ctx = canvas && canvas.getContext('2d');
        if (!ctx || !width || !height) {
          return;
        }
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      },
    };

    /**
     * Maps datasets for Chart.js configuration.
     *
     * @param {ChartDataSets[]} [datasets=[]]
     * @param {Omit<ChartDataSets, 'data'>} [chartDataSets]
     * @return {*}  {ChartData['datasets']}
     */
    const setDatasets = (
      datasets: ChartDataSets[] = [],
      chartDataSets?: Omit<ChartDataSets, 'data'>
    ): ChartData['datasets'] =>
      datasets.map(({ data }) => ({
        ...chartDataSets,
        data,
      }));

    const config = {
      type: 'bar',
      plugins: [plugin],
      options: {
        layout: {
          padding: 30,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontColor: 'black',
                fontSize: 30,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                fontColor: 'black',
                fontSize: 30,
              },
            },
          ],
        },
      },
      data: {
        labels: this.chartData.labels,
        datasets: setDatasets(this.chartData.datasets, {
          backgroundColor: () =>
            `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        }),
      },
    };

    return await this.chartJSNodeCanvas.renderToBufferSync(
      config,
      'image/svg+xml'
    );
  }
}
