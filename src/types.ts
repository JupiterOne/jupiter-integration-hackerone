import {
  EntityFromIntegration,
  MappedRelationshipFromIntegration,
  RelationshipFromIntegration,
} from "@jupiterone/jupiter-managed-integration-sdk";

export interface ServiceEntity extends EntityFromIntegration {
  category: string;
  handle: string;
}

export interface FindingEntity extends EntityFromIntegration {
  state: string;
  details: string;
  title: string;
  id: string;
  type: string;
  open: boolean;
  createdOn?: number;
  disclosedOn?: number;
  firstActivityAt?: number; //
  lastActivityAt?: number; //
  triagedOn?: number;
  closedOn?: number;
  severity?: string;
  score?: number | null;
  numericSeverity?: number | null;
  scope?: string | null;
  targets?: string | string[] | null;
  vector?: string;
  complexity?: string;
  confidentiality?: string;
  integrity?: string;
  availability?: string;
  privileges?: string;
  interaction?: string;
  bountyAmount?: number;
  bountyBonusAmount?: number;
  bountyAwardedOn?: number;
  totalAmountAwarded?: number;
  hackerAlias: string;
  hackerProfilePic?: string;
}

export interface VulnerabilityEntity extends EntityFromIntegration {
  name?: string;
  description?: string;
}

export interface WeaknessEntity extends EntityFromIntegration {
  name: string;
  description: string;
}

export interface AttackEntity extends EntityFromIntegration {
  name: string;
  description: string;
}

export type ServiceFindingRelationship = RelationshipFromIntegration;

export type FindingVulnerabilityRelationship = MappedRelationshipFromIntegration;

export type FindingWeaknessRelationship = MappedRelationshipFromIntegration;

export interface HackerOneIntegrationInstanceConfig {
  hackeroneApiKey: string;
  hackeroneApiKeyName: string;
  hackeroneProgramHandle: string;
}
