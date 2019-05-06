import HackeroneClient from "hackerone-client";

import {
  IntegrationExecutionContext,
  PersisterOperationsResult,
} from "@jupiterone/jupiter-managed-integration-sdk";

import { toFindingEntity, toServiceFindingRelationship } from "./converters";
import { createOperationsFromFindings } from "./createOperations";
import {
  FindingEntity,
  HackerOneIntegrationInstanceConfig,
  ServiceEntity,
  ServiceFindingRelationship,
} from "./types";

export default async function synchronize(
  context: IntegrationExecutionContext,
): Promise<PersisterOperationsResult> {
  const { persister } = context.clients.getClients();

  const config = context.instance.config as HackerOneIntegrationInstanceConfig;
  const Hackerone = new HackeroneClient(
    config.hackeroneApiKey,
    config.hackeroneApiKeyName,
  );

  const service: ServiceEntity = {
    _key: `hackerone:${config.hackeroneProgramHandle}`,
    _type: "hackerone_program",
    _class: "Service",
    category: "bug-bounty",
    handle: config.hackeroneProgramHandle,
  };
  const serviceFindingRelationships: ServiceFindingRelationship[] = [];
  const serviceEntities: ServiceEntity[] = [service];
  const findingEntities: FindingEntity[] = [];

  const reports = await Hackerone.queryReports(config.hackeroneProgramHandle);

  for (const reportCollection of reports) {
    for (const report of reportCollection) {
      const finding: FindingEntity = toFindingEntity(report);
      findingEntities.push(finding);
      serviceFindingRelationships.push(
        toServiceFindingRelationship(service, finding),
      );
    }
  }

  return persister.publishPersisterOperations(
    await createOperationsFromFindings(
      context,
      serviceEntities,
      findingEntities,
      serviceFindingRelationships,
    ),
  );
}
