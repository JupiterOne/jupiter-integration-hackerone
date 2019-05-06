import HackeroneClient from "hackerone-client";

import {
  IntegrationExecutionContext,
  PersisterOperationsResult,
} from "@jupiterone/jupiter-managed-integration-sdk";

import { HACKERONE_SERVICE_ENTITY_TYPE } from "./constants";
import {
  toFindingEntity,
  toServiceFindingRelationship,
  toWeaknessEntity,
  toWeaknessRelationship,
} from "./converters";
import { createOperationsFromFindings } from "./createOperations";
import {
  FindingEntity,
  FindingWeaknessRelationship,
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
    _type: HACKERONE_SERVICE_ENTITY_TYPE,
    _class: "Service",
    category: "bug-bounty",
    handle: config.hackeroneProgramHandle,
  };
  const serviceFindingRelationships: ServiceFindingRelationship[] = [];
  const findingWeaknessRelationships: FindingWeaknessRelationship[] = [];
  const serviceEntities: ServiceEntity[] = [service];
  const findingEntities: FindingEntity[] = [];

  const reports = await Hackerone.queryReports(config.hackeroneProgramHandle);

  for (const reportCollection of reports) {
    for (const report of reportCollection) {
      const finding = toFindingEntity(report);
      findingEntities.push(finding);
      serviceFindingRelationships.push(
        toServiceFindingRelationship(service, finding),
      );
      if (report.relationships.weakness) {
        const weakness = toWeaknessEntity(report.relationships.weakness);
        if (weakness) {
          findingWeaknessRelationships.push(
            toWeaknessRelationship(finding, weakness),
          );
        }
      }
    }
  }

  return persister.publishPersisterOperations(
    await createOperationsFromFindings(
      context,
      serviceEntities,
      findingEntities,
      serviceFindingRelationships,
      findingWeaknessRelationships,
    ),
  );
}
