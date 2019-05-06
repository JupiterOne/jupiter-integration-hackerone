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
}

export interface ReportAttributes {
  title: string;
  vulnerability_information: string;
  state: string;
}

export function toFindingEntity(report: Report): FindingEntity {
  const finding: ReportAttributes = report.attributes;
  return {
    _class: "Finding",
    _key: `hackerone-report-${report.id}`,
    _type: HACKERONE_REPORT_ENTITY_TYPE,
    id: report.id,
    type: report.type,
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
    _class: "IDENTIFIED",
    _key: `${serviceEntity._key}|identified|${findingEntity._key}`,
    _type: HACKERONE_SERVICE_FINDING_RELATIONSHIP_TYPE,

    _fromEntityKey: serviceEntity._key,
    _toEntityKey: findingEntity._key,
  };
}
