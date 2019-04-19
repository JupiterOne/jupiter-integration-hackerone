"use strict";
exports.__esModule = true;
var mockAtt1 = {
    title: "Bad Finding",
    vulnerability_information: "This is information about the really bad thing.",
    state: "resolved"
};
var mockAtt2 = {
    title: "Bad Finding 2",
    vulnerability_information: "This is information about a bad thing",
    state: "resolved"
};
var mockReport1 = {
    id: "12345",
    type: "report",
    attributes: mockAtt1
};
var mockReport2 = {
    id: "67890",
    type: "report",
    attributes: mockAtt2
};
var mockReports = [[mockReport1, mockReport2]];
exports["default"] = {
    getVulnerabilities: jest.fn().mockResolvedValue(mockReports),
    getResources: jest.fn().mockResolvedValue(mockReports)
};
/*
interface ResourcesData {
  account: AccountData;
}

const mockApplication: ApplicationData = {
  id: "123456",
  label: "my-app",
};

const mockFinding: FindingData = {
  application: mockApplication,
  class: "My.Mock.Class",
  class_readable: "My Mock Class",
  closed: null,
  cve_reference: {
    collection: [
      {
        link: "https://cve-website.com/cve",
        title: "Very Bad Vulnerability",
      },
    ],
  },
  cvss_v3_score: "6.9",
  cvss_v3_vector: "A:B:C:D:E:F:G",
  found: Date.now().toString(),
  id: 987,
  impact: 5,
  likelihood: 2,
  location: "somewhere.js",
  modified: Date.now().toString(),
  opened: Date.now().toString(),
  risk: "low",
  status: "open",
};

const mockResources: ResourcesData = {
  account: {
    company: "LifeOmic",
  },
};

export default {
  getVulnerabilities: jest.fn().mockResolvedValue([mockFinding]),
  getResources: jest.fn().mockResolvedValue(mockResources),
};
*/
