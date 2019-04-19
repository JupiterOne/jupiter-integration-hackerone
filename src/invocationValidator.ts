import {
  IntegrationExecutionContext,
  IntegrationInstanceAuthenticationError,
  IntegrationInstanceConfigError,
  IntegrationInvocationEvent,
} from "@jupiterone/jupiter-managed-integration-sdk";
import HackeroneClient from "hackerone-client";
import { HackerOneIntegrationInstanceConfig } from "./types";

export default async function invocationValidator(
  context: IntegrationExecutionContext<IntegrationInvocationEvent>,
) {
  const config = context.instance.config as HackerOneIntegrationInstanceConfig;

  if (!config) {
    throw new IntegrationInstanceConfigError("Missing configuration");
  } else if (!config.hackeroneApiKey) {
    throw new IntegrationInstanceConfigError("hackeroneApiKey is required");
  } else if (!config.hackeroneApiKeyName) {
    throw new IntegrationInstanceConfigError("hackeroneApiKeyName is required");
  }

  const provider = new HackeroneClient(config.hackeroneApiKey, config.hackeroneApiKeyName);
  try {
    await provider.getResources();
  } catch (err) {
    throw new IntegrationInstanceAuthenticationError(err);
  }
}
