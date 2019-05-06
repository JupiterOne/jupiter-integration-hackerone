import {
  HACKERONE_REPORT_ENTITY_TYPE,
  HACKERONE_SERVICE_FINDING_RELATIONSHIP_TYPE,
} from "./constants";
import {
  FindingEntity,
  ServiceEntity,
  ServiceFindingRelationship,
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
    ...details,
  };
}

export function toServiceFindingRelationship(
  serviceEntity: ServiceEntity,
  findingEntity: FindingEntity,
): ServiceFindingRelationship {
  return {
    _class: "IDENTIFIED",
    _key: `${serviceEntity._key}|identified|${findingEntity._key}`,
    _type: HACKERONE_SERVICE_FINDING_RELATIONSHIP_TYPE,

    _fromEntityKey: serviceEntity._key,
    _toEntityKey: findingEntity._key,
  };
}

function getTime(time: Date | string | undefined | null): number | undefined {
  return time ? new Date(time).getTime() : undefined;
}
