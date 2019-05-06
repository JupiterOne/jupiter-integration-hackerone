import {
  EntityFromIntegration,
  RelationshipDirection,
} from "@jupiterone/jupiter-managed-integration-sdk";

import {
  HACKERONE_FINDING_WEAKNESS_RELATIONSHIP_TYPE,
  HACKERONE_REPORT_ENTITY_TYPE,
  HACKERONE_SERVICE_FINDING_RELATIONSHIP_TYPE,
} from "./constants";
import {
  AttackEntity,
  FindingEntity,
  FindingWeaknessRelationship,
  ServiceEntity,
  ServiceFindingRelationship,
  WeaknessEntity,
} from "./types";

export interface QueryResult {
  data: Report[];
}

export interface Report {
  id: string;
  type: string;
  attributes: ReportAttributes;
  relationships: ReportRelationships;
}

export interface ReportAttributes {
  title: string;
  vulnerability_information: string;
  state: string;
  created_at: Date | null;
  disclosed_at: Date | null;
  last_activity_at: Date | null;
  triaged_at: Date | null;
  closed_at: Date | null;
}

export interface ReportRelationships {
  severity?: Severity;
  weakness?: Weakness;
}

export interface Severity {
  rating: string;
  score?: number | null;
  attack_vector?: string;
  attack_complexity?: string;
  privileges_required?: string;
  user_interaction?: string;
  scope?: string | null;
  confidentiality?: string;
  integrity?: string;
  availability?: string;
}

export interface Weakness {
  id: string;
  type?: string;
  attributes: {
    name: string;
    description: string;
    external_id?: string;
    created_at: Date;
  };
}

export function toFindingEntity(report: Report): FindingEntity {
  const attributes: ReportAttributes = report.attributes;
  const relationships: ReportRelationships = report.relationships;
  let details;
  if (relationships.severity) {
    details = {
      severity: relationships.severity.rating,
      score: relationships.severity.score,
      scope: relationships.severity.scope,
      targets: relationships.severity.scope,
      numericSeverity: relationships.severity.score,
      vector: relationships.severity.attack_vector,
      complexity: relationships.severity.attack_complexity,
      confidentiality: relationships.severity.confidentiality,
      integrity: relationships.severity.integrity,
      availability: relationships.severity.availability,
      privileges: relationships.severity.privileges_required,
      interaction: relationships.severity.user_interaction,
    };
  }
  return {
    _class: "Finding",
    _key: `hackerone-report-${report.id}`,
    _type: HACKERONE_REPORT_ENTITY_TYPE,
    id: report.id,
    type: report.type,
    title: attributes.title,
    displayName: attributes.title,
    details: attributes.vulnerability_information,
    state: attributes.state,
    open:
      attributes.state === "new" ||
      attributes.state === "triaged" ||
      attributes.state === "needs-more-info",
    createdOn: getTime(attributes.created_at),
    disclosedOn: getTime(attributes.disclosed_at),
    updatedOn: getTime(attributes.last_activity_at),
    triagedOn: getTime(attributes.triaged_at),
    closedOn: getTime(attributes.closed_at),
    webLink: `https://hackerone.com/bugs?report_id=${report.id}`,
    ...details,
  };
}

export function toWeaknessEntity(
  weakness: Weakness,
): WeaknessEntity | AttackEntity | undefined {
  const attributes = weakness.attributes;
  if (attributes.external_id) {
    const id = attributes.external_id.toLowerCase();
    if (id.startsWith("cwe-")) {
      return {
        _key: id,
        _type: "cwe",
        _class: "Weakness",
        name: attributes.name,
        displayName: id.toUpperCase(),
        description: attributes.description,
        webLink: `https://cwe.mitre.org/data/definitions/${
          id.split("-")[1]
        }.html`,
      };
    } else if (id.startsWith("capec-")) {
      return {
        _key: id,
        _type: "capec",
        _class: "Attack",
        name: attributes.name,
        displayName: id.toUpperCase(),
        description: attributes.description,
        webLink: `https://capec.mitre.org/data/definitions/${
          id.split("-")[1]
        }.html`,
      };
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

export function toServiceFindingRelationship(
  service: ServiceEntity,
  finding: FindingEntity,
): ServiceFindingRelationship {
  return {
    _class: "IDENTIFIED",
    _key: `${service._key}|identified|${finding._key}`,
    _type: HACKERONE_SERVICE_FINDING_RELATIONSHIP_TYPE,
    _fromEntityKey: service._key,
    _toEntityKey: finding._key,
    displayName: "IDENTIFIED",
  };
}

function getTime(time: Date | string | undefined | null): number | undefined {
  return time ? new Date(time).getTime() : undefined;
}

export function toWeaknessRelationship(
  finding: FindingEntity,
  targetEntity: EntityFromIntegration,
): FindingWeaknessRelationship {
  return {
    _key: `${finding._key}|exploits|${finding._key}`,
    _class: "EXPLOITS",
    _type: HACKERONE_FINDING_WEAKNESS_RELATIONSHIP_TYPE,
    _mapping: {
      sourceEntityKey: finding._key,
      relationshipDirection: RelationshipDirection.FORWARD,
      targetFilterKeys: [["_type", "_key"]],
      targetEntity,
    },
    displayName: "EXPLOITS",
  };
}
