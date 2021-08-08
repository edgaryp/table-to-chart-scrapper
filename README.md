# Table To Chart Scrapper

## User Story

### Description

As a user, I would like to be able to enter a website URL and it will scrap the website and convert the tables into a chart. This would allow me to analyse the numeric data in graphical representation.

### Acceptance Criteria

#### AC1

**_GIVEN_** a website contains multiple tables

**_WHEN_** I enter the URL to the application

**_THEN_** I must see chart images are saved in `/client` directory

#### AC2

**_GIVEN_** a table doesn't contain any numeric data in the column

**_THEN_** no charts should be generated and saved in `/client` directory

## Scoping

There are various type and data of the tables on the Wikipedia site, the initial iteration of development will focus on the following objectives as POC:

1. **MUST** only target at simple table.

```html
<!-- Simple table -->
<table>
  <thead>
    <tr>
      <th>Column A title</th>
      <th>Column B title</th>
      <th>Column C title</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>A</td>
      <td>B</td>
      <td>C</td>
    </tr>
    <tr>
      <td>A</td>
      <td>B</td>
      <td>C</td>
    </tr>
  </tbody>
</table>
```

2. **MUST** accept additional class selectors for targeting specific tables.
3. **MUST** save the chart image in jpeg format.
4. **MUST** able to process multiple tables from the website and save the tables as separated files.

## Implementation

One of the first tasks of this project is crawling the website, and this can be achieved with a few different choices of languages and its own ecosystem.

As frontend developer, the first go to language has always been Javascript/Typescript. While I am open to other options (currently exploring Swift and Python on my own time), for the sack of simplicity, Node.js is the most logical choice for the project.

| Language   | Crawling Tool | Developer Experience | Learn Curve |
| ---------- | ------------- | -------------------- | ----------- |
| Python     | Scrapy        | ✅                   | 🧐          |
| Javascript | Puppeteer     | ✅                   | 😀          |

### 3 steps

The concept of the project is fairly straightforward and can be broken down into 3 main steps:

![3_steps](./docs/assets/3_steps.jpg '3_steps')

1. Crawling the website of the given URL.

2. Extract table elements from the website content and convert the table element into a usable data structure.

3. Inject data into the chart and save it as a jpeg image.

### Tech Stack

1. Node.js2. puppeteer: A library that crawls the websites and returns entire HTML content as a string.3. cheerio: A library that process HTML string (from Puppeteer) and can be operated with jQuery methods.4. chartjs-node-canvas: It allows us to use Chart.js in Node.js environment.5. Others: Typescript, sharp, nodemon... etc as baseline dependencies for the project.

### Limitation

1. As mentioned earlier, the logic will only focus on simple tables. For example, tables contain nested tables will not work. We will skip those tables via providing `containClasses` when using `tableToJson`.

## Commits

In order to create a more comprehensible commit history with consistency this services uses conventional commits.

Conventional commits follow the convention of using change types. Which allow for quick identification of what a certain commit is doing. The most common types are feat and fix, and more are listed below. Types aren’t always required, but in situations where a commit is doing something that is difficult to discern without looking into the code, assigning a type in the commit message can be helpful.

| **Type** | **Description**                                                          |
| -------- | ------------------------------------------------------------------------ |
| feat     | A new feature (this correlates with MINOR in semantic versioning)        |
| fix      | A bug fix (this correlates with PATCH in semantic versioning)            |
| docs     | Changes to documentation                                                 |
| refactor | A code change that neither fixes a bug nor adds a feature                |
| test     | Adding missing tests or correcting existing tests                        |
| chore    | Updating dependencies, build process etc; no production code change      |
| build    | Changes that affect external dependencies (e.g. gulp, npm, composer)     |
| ci       | Changes to CI configuration files and scripts                            |
| perf     | Changes that improve performance                                         |
| style    | Syntax/formatting related changes (e.g. white space, missing semicolons) |
| rfc      | Changes to a RFC                                                         |

## Install/Run

To setup the repository, follow these steps:

1. Install the project dependencies `npm install`
2. `yarn dev` to run development server

## What's next

1. Extend the logic to cover complex tables.
2. Provide a UI for receiving URLs from the user.
