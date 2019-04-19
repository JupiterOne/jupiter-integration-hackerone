import {
  EntityFromIntegration,
  EntityOperation,
  IntegrationExecutionContext,
  IntegrationInvocationEvent,
  PersisterOperations,
  RelationshipFromIntegration,
  RelationshipOperation,
} from "@jupiterone/jupiter-managed-integration-sdk";
import {
  HACKERONE_FINDING_ENTITY_TYPE,
  HACKERONE_SERVICE_ENTITY_TYPE,
  HACKERONE_SERVICE_FINDING_RELATIONSHIP_TYPE
} from "./constants";
import {
  ServiceEntity,
  FindingEntity,
  ServiceFindingRelationship,
} from "./types";

export async function createOperationsFromFindings(
  context: IntegrationExecutionContext<IntegrationInvocationEvent>,
  serviceEntities: ServiceEntity[],
  findingEntities: FindingEntity[],
  serviceFindingRelationships: ServiceFindingRelationship[]
): Promise<PersisterOperations> {
  

  const entityOperations = [
    ...(await toEntityOperations(
      context,
      serviceEntities,
      HACKERONE_SERVICE_ENTITY_TYPE,
    )),
    ...(await toEntityOperations(
      context,
      findingEntities,
      HACKERONE_FINDING_ENTITY_TYPE,
    )),
  ];

  const relationshipOperations = [
    ...(await toRelationshipOperations(
      context,
      serviceFindingRelationships,
      HACKERONE_SERVICE_FINDING_RELATIONSHIP_TYPE,
    )),
  ];

  return [entityOperations, relationshipOperations];
}


async function toEntityOperations<T extends EntityFromIntegration>(
  context: IntegrationExecutionContext<IntegrationInvocationEvent>,
  entities: T[],
  type: string,
): Promise<EntityOperation[]> {
  const { graph, persister } = context.clients.getClients();
  const oldEntities = await graph.findEntitiesByType(type);
  return persister.processEntities(oldEntities, entities);
}

async function toRelationshipOperations<T extends RelationshipFromIntegration>(
  context: IntegrationExecutionContext<IntegrationInvocationEvent>,
  relationships: T[],
  type: string,
): Promise<RelationshipOperation[]> {
  const { graph, persister } = context.clients.getClients();
  const oldRelationships = await graph.findRelationshipsByType(type);
  return persister.processRelationships(oldRelationships, relationships);
}
