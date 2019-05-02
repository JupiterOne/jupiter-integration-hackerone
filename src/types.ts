import {
  EntityFromIntegration,
  RelationshipFromIntegration,
} from "@jupiterone/jupiter-managed-integration-sdk";

export interface ServiceEntity extends EntityFromIntegration {
  category: string;
  id: string;
  type: string;
}

export interface FindingEntity extends EntityFromIntegration {
  state: string;
  vulnerability_information: string;
  title: string;
}

export type ServiceFindingRelationship = RelationshipFromIntegration;

export interface HackerOneIntegrationInstanceConfig {
  hackeroneApiKey: string;
  hackeroneApiKeyName: string;
}
