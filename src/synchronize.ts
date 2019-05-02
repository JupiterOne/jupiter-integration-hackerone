import HackeroneClient from "hackerone-client";

import {
  IntegrationExecutionContext,
  PersisterOperationsResult,
} from "@jupiterone/jupiter-managed-integration-sdk";

import {
  toFindingEntity,
  toServiceEntity,
  toServiceFindingRelationship,
} from "./converters";
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
  const serviceFindingRelationships: ServiceFindingRelationship[] = [];
  const serviceEntities: ServiceEntity[] = [];
  const findingEntities: FindingEntity[] = [];

  const reports = await Hackerone.queryReports("lifeomic");

  for (const reportCollection of reports) {
    for (const report of reportCollection) {
      const service: ServiceEntity = toServiceEntity(report);
      const finding: FindingEntity = toFindingEntity(report.attributes);
      serviceEntities.push(service);
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
