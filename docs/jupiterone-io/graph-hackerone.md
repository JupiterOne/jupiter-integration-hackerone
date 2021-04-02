# HackerOne

## Overview

JupiterOne provides a managed integration with HackerOne. The integration
connects directly to HackerOne APIs to obtain account metadata and analyze
resource relationships. Customers authorize access by creating an API token in
their target HackerOne account and providing that credential to JupiterOne.

## HackerOne

- Visualize HackerOne bounty programs and submitted findings in the JupiterOne
  graph. 
- Monitor HackerOne findings within the alerts app.
- Monitor changes to HackerOne bounty programs using JupiterOne alerts.

## How it Works

- JupiterOne periodically fetches HackerOne bounty programs and submitted findings to update the graph.
- Write JupiterOne queries to review and monitor updates to the graph.
- Configure alerts to take action when the JupiterOne graph changes.

## Requirements

- JupiterOne requires an API key, API key name, and the name/handle of your HackerOne program. 
- You must have permission in JupiterOne to install new integrations.

## Integration Instance Configuration

The integration is triggered by an event containing the information for a
specific integration instance.

HackerOne provides [detailed instructions on creating an API token][1] within
your HackerOne account.

## Entities

The following entity resources are ingested when the integration runs:

| Example Entity Resource | \_type : \_class of the Entity  |
| ----------------------- | ------------------------------- |
| Program                 | `hackerone_program` : `Service` |
| Finding Report          | `hackerone_report` : `Finding`  |

## Relationships

The following relationships are created/mapped:

| From                | Relationship   | To                 |
| ------------------- | -------------- | ------------------ |
| `hackerone_program` | **IDENTIFIED** | `hackerone_report` |
| `hackerone_report`  | **IS**         | `cve`              |
| `hackerone_report`  | **IS**         | `cwe`              |

[1]: https://docs.hackerone.com/programs/api-tokens.html
