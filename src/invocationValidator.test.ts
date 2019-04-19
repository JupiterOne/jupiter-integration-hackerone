
import {
  createTestIntegrationExecutionContext,
  IntegrationInstanceAuthenticationError
} from "@jupiterone/jupiter-managed-integration-sdk";
import mockHackerOneClient from "../test/helpers/mockHackerOneClient";
import invocationValidator from "./invocationValidator";
import { HackerOneIntegrationInstanceConfig } from "./types";


jest.mock("@jupiterone/whitehat-client", () => {
  return jest.fn().mockImplementation(() => mockHackerOneClient);
});

const validConfig: HackerOneIntegrationInstanceConfig = {
  hackeroneApiKey: "9Ts8WE6xLsoceClXk5y1w8VmF6oICfqOyRP/83is/F0=",
  hackeroneApiKeyName: "j1_prodsec_integration"
};

const invalidConfig: HackerOneIntegrationInstanceConfig = {
  hackeroneApiKey: "idk",
  hackeroneApiKeyName: "not_real"
};

const noNameConfig: HackerOneIntegrationInstanceConfig = {
  hackeroneApiKey: "9Ts8WE6xLsoceClXk5y1w8VmF6oICfqOyRP/83is/F0=",
  hackeroneApiKeyName: ""
};



test("fails with invalid config", async () => {
  const executionContext = createTestIntegrationExecutionContext({
    instance: {
      config: invalidConfig,
    },
  });

  await expect(invocationValidator(executionContext)).rejects.toThrow(
    IntegrationInstanceAuthenticationError
  );
});


test("passes with valid config", async () => {
  const executionContext = createTestIntegrationExecutionContext({
    instance: {
      config: validConfig,
    },
  });

  expect(() => {
    invocationValidator(executionContext);
  }).not.toThrow();
});
  

test("throws error if no api key name is provided", async () => {
  const executionContext = createTestIntegrationExecutionContext({
    instance: {
      config: noNameConfig,
    },
  });
  await expect(invocationValidator(executionContext)).rejects.toThrow(
    "hackeroneApiKeyName is required",
  );
});

test("throws error if config not provided", async () => {
  const executionContext = createTestIntegrationExecutionContext();
  await expect(invocationValidator(executionContext)).rejects.toThrow(
    "Missing configuration",
  );
});

test("throws error if API key is not provided in instance config", async () => {
  const executionContext = createTestIntegrationExecutionContext({
    instance: {
      config: {},
    },
  });
  await expect(invocationValidator(executionContext)).rejects.toThrow(
    "hackeroneApiKey is required",
  );
});

test("throws error if hackerone responds with error to resource call", async () => {
  const executionContext = createTestIntegrationExecutionContext({
    instance: {
      config: validConfig,
    },
  });

  mockHackerOneClient.getResources = jest.fn().mockImplementation(() => {
    throw new Error("401");
  });

  await expect(invocationValidator(executionContext)).rejects.toThrow(
    Error,
  );
});

