
import {
  createTestIntegrationData,
  createTestIntegrationExecutionContext,
} from "@jupiterone/jupiter-managed-integration-sdk";
import mockHackeroneClient from "../test/helpers/mockHackerOneClient";
import synchronize from "./synchronize";

require('dotenv').config();

jest.mock("hackerone-client", () => {
  return jest.fn().mockImplementation(() => mockHackeroneClient);
});

const persisterOperations = {
  created: 1,
  deleted: 0,
  updated: 0,
};

const executionContext = createTestIntegrationExecutionContext();
const { job: mockIntegrationJob } = createTestIntegrationData();

executionContext.instance.config = {
  hackeroneApiKey: process.env.HACKERONE_API_KEY,
  hackeroneApiKeyName: process.env.HACKERONE_API_KEY_NAME,
};

jest.setTimeout(60000);

jest
  .spyOn(executionContext.clients.getClients().graph, "findEntities")
  .mockResolvedValue([]);

jest
  .spyOn(executionContext.clients.getClients().graph, "findRelationships")
  .mockResolvedValue([]);

jest
  .spyOn(
    executionContext.clients.getClients().persister,
    "publishPersisterOperations",
  )
  .mockResolvedValue(persisterOperations);




test("compiles and runs", async () => {
  const result = await synchronize(executionContext);
  expect(result).toEqual(persisterOperations);
});


test("uses last job created date for provider queries", async () => {
  jest
    .spyOn(executionContext.clients.getClients().jobs, "getLastCompleted")
    .mockResolvedValue(mockIntegrationJob);

  const result = await synchronize(executionContext);
  expect(result).toEqual(persisterOperations);
});

