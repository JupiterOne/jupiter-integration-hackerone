import { createTestIntegrationExecutionContext } from "@jupiterone/jupiter-managed-integration-sdk";

import mockHackerOneClient from "../test/helpers/mockHackerOneClient";
import invocationValidator from "./invocationValidator";
import { HackerOneIntegrationInstanceConfig } from "./types";

jest.mock("hackerone-client", () => {
  return jest.fn().mockImplementation(() => mockHackerOneClient);
});

test("passes with valid config", async () => {
  const validintegrationConfig = {
    hackeroneApiKey: "api-key",
    hackeroneApiKeyName: "api-key-name",
  };
  const validConfig = validintegrationConfig as HackerOneIntegrationInstanceConfig;

  const executionContext = createTestIntegrationExecutionContext({
    instance: {
      config: validConfig,
    },
  });

  await expect(() => {
    invocationValidator(executionContext);
  }).not.toThrow();
});

test("throws error if no api key name is provided", async () => {
  const noNameConfig: HackerOneIntegrationInstanceConfig = {
    hackeroneApiKey: "keydatastuff",
    hackeroneApiKeyName: "",
  };

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
