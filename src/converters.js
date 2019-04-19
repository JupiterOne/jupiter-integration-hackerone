"use strict";
exports.__esModule = true;
var constants_1 = require("./constants");
function toServiceEntity(report) {
    return {
        _class: "Service",
        _key: "hackerone-report-" + report.id,
        _type: constants_1.HACKERONE_SERVICE_ENTITY_TYPE,
        category: "other",
        id: report.id,
        type: report.type
    };
}
exports.toServiceEntity = toServiceEntity;
function toFindingEntity(finding) {
    return {
        _class: "Finding",
        _key: "hackerone-finding-" + finding.title,
        _type: constants_1.HACKERONE_FINDING_ENTITY_TYPE,
        title: finding.title,
        vulnerability_information: finding.vulnerability_information,
        state: finding.state
    };
}
exports.toFindingEntity = toFindingEntity;
function toServiceFindingRelationship(serviceEntity, findingEntity) {
    return {
        _class: "HAS",
        _key: serviceEntity._key + "|has|" + findingEntity._key,
        _type: constants_1.HACKERONE_SERVICE_FINDING_RELATIONSHIP_TYPE,
        _fromEntityKey: serviceEntity._key,
        _toEntityKey: findingEntity._key
    };
}
exports.toServiceFindingRelationship = toServiceFindingRelationship;
