import {
  IntegrationExecutionContext,
  IntegrationInvocationEvent,
  PersisterOperationsResult,
} from "@jupiterone/jupiter-managed-integration-sdk";
import HackeroneClient from "hackerone-client";


import {
  toServiceEntity,
  toFindingEntity,
  toServiceFindingRelationship
} from "./converters";



import {
  createOperationsFromFindings,
} from "./createOperations";
import {
  ServiceEntity,
  FindingEntity,
  ServiceFindingRelationship,
  HackerOneIntegrationInstanceConfig
} from "./types";


export default async function synchronize(
  context: IntegrationExecutionContext<IntegrationInvocationEvent>,
): Promise<PersisterOperationsResult> {
  const { persister, jobs } = context.clients.getClients();

  const config = context.instance.config as HackerOneIntegrationInstanceConfig;
  const Hackerone = new HackeroneClient(config.hackeroneApiKey, config.hackeroneApiKeyName);
  const serviceFindingRelationships: ServiceFindingRelationship[] = [];
  const serviceEntities: ServiceEntity[] = [];
  const findingEntities: FindingEntity[] = [];

  var reports = await Hackerone.queryReports('lifeomic');
  var i, j;
  
  for (i = 0; i < reports.length; i++) {
    for (j = 0; j < reports[i].length; j++) {
      const service: ServiceEntity = toServiceEntity(reports[i][j])
      const finding: FindingEntity = toFindingEntity(reports[i][j].attributes);
      serviceEntities.push(service);
      findingEntities.push(finding);
      serviceFindingRelationships.push(toServiceFindingRelationship(service, finding));
    }

  }
  
  const queryParams = ["query_status=open,closed"];

  const lastJob = await jobs.getLastCompleted();
  if (lastJob) {
    const lastJobCreatedDate = new Date(lastJob.createDate).toISOString();
    queryParams.push(
      `query_opened_after=${lastJobCreatedDate}`,
      `query_closed_after=${lastJobCreatedDate}`,
      `query_found_after=${lastJobCreatedDate}`,
    );
  }

  return persister.publishPersisterOperations(
    await createOperationsFromFindings(
      context,
      serviceEntities,
      findingEntities,
      serviceFindingRelationships
    ),
  );

}