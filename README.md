# JupiterOne HackerOne Integration

This project creates an open-source integration between JupiterOne and HackerOne. 

By using custom JupiterOne queries, you can get the most out of HackerOne reports
by easily finding specific datasets.

Examples of results that should be easily attainable through J1 queries include:
  * Sort reports by priority, and find how many open reports are present for each priority
  * Sort reports by target, and find which assets have the most vulnerabilities
  * Sort reports by hacker, and find who creates the most valid reports

# Development Environment and Dependencies

Run the following commands to install the necessary dependencies and get started.
  1. `yarn install`
  2. `yarn start:graph` (uses a docker container to graph results, download <a href="https://github.com/bricaud/graphexp" target="_blank">this</a> repository)
  3. `yarn start`

This integration utilizes our open-source JavaSciprt HackerOne client, found <a href="https://www.npmjs.com/package/hackerone-client" target="_blank">here</a>


# Local Tests

Simply run `yarn test`



Development is still in progess, and features will continue to be added.

