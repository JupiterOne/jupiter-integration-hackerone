import {
  HACKERONE_FINDING_ENTITY_TYPE,
  HACKERONE_SERVICE_ENTITY_TYPE,
  HACKERONE_SERVICE_FINDING_RELATIONSHIP_TYPE
} from "./constants";
import {
  ServiceEntity,
  FindingEntity,
  ServiceFindingRelationship
} from "./types";


export interface QueryResult {
  data: Report[];
}

export interface Report {
  id: string,
  type: string,
  attributes: ReportAttribute
}

export interface ReportAttribute {
  title: string,
  vulnerability_information: string,
  state: string
}


export function toServiceEntity(report: Report): ServiceEntity {
  return {
    _class: "Service",
    _key: `hackerone-report-${report.id}`,
    _type: HACKERONE_SERVICE_ENTITY_TYPE,
    category: "other",
    id: report.id,
    type: report.type
  };
}


export function toFindingEntity(finding: ReportAttribute): FindingEntity {
  return {
    _class: "Finding",
    _key: `hackerone-finding-${finding.title}`,
    _type: HACKERONE_FINDING_ENTITY_TYPE,

    title: finding.title,
    vulnerability_information: finding.vulnerability_information,
    state: finding.state,

  };
}


export function toServiceFindingRelationship(
  serviceEntity: ServiceEntity,
  findingEntity: FindingEntity,
): ServiceFindingRelationship {
  return {
    _class: "HAS",
    _key: `${serviceEntity._key}|has|${findingEntity._key}`,
    _type: HACKERONE_SERVICE_FINDING_RELATIONSHIP_TYPE,

    _fromEntityKey: serviceEntity._key,
    _toEntityKey: findingEntity._key,
  };
}