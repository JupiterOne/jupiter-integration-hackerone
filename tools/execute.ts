/* tslint:disable:no-console */
import { executeIntegrationLocal } from "@jupiterone/jupiter-managed-integration-sdk";
import invocationConfig from "../src/index";

const integrationConfig = {
  hackeroneApiKey: process.env.HACKERONE_API_KEY,
  hackeroneApiKeyName: process.env.HACKERONE_API_KEY_NAME,
  hackeroneProgramHandle: process.env.HACKERONE_PROGRAM_HANDLE,
};

const invocationArgs = {
  // providerPrivateKey: process.env.PROVIDER_LOCAL_EXECUTION_PRIVATE_KEY
};

executeIntegrationLocal(
  integrationConfig,
  invocationConfig,
  invocationArgs,
).catch(err => {
  console.error(err);
  process.exit(1);
});
