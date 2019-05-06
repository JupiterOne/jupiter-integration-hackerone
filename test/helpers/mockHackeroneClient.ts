import { Report, ReportAttributes } from "../../src/converters";

const mockAtt1: ReportAttributes = {
  title: "Bad Finding",
  vulnerability_information: "This is information about the really bad thing.",
  state: "resolved",
  created_at: new Date("2016-02-02T04:05:06.000Z"),
  disclosed_at: null,
  last_activity_at: null,
  triaged_at: null,
  closed_at: null,
  cve_ids: ["cve-2019-12345", "bogus-cve-id"],
};

const mockAtt2: ReportAttributes = {
  title: "Bad Finding 2",
  vulnerability_information: "This is information about a bad thing",
  state: "resolved",
  created_at: new Date("2016-02-02T04:05:06.000Z"),
  disclosed_at: null,
  last_activity_at: null,
  triaged_at: null,
  closed_at: null,
};

const mockReport1: Report = {
  id: "12345",
  type: "report",
  attributes: mockAtt1,
  relationships: {
    severity: {
      rating: "high",
    },
    weakness: {
      id: "1337",
      type: "weakness",
      attributes: {
        name: "Cross-Site Request Forgery (CSRF)",
        description:
          "The web application does not, or can not, sufficiently verify whether a well-formed, valid, consistent request was intentionally provided by the user who submitted the request.",
        created_at: new Date("2016-02-02T04:05:06.000Z"),
        external_id: "cwe-352",
      },
    },
  },
};

const mockReport2: Report = {
  id: "67890",
  type: "report",
  attributes: mockAtt2,
  relationships: {},
};

const mockReport3: Report = {
  id: "67891",
  type: "report",
  attributes: mockAtt2,
  relationships: {
    weakness: {
      id: "1337",
      type: "weakness",
      attributes: {
        name: "Cross-Site Request Forgery (CSRF)",
        description:
          "The web application does not, or can not, sufficiently verify whether a well-formed, valid, consistent request was intentionally provided by the user who submitted the request.",
        created_at: new Date("2016-02-02T04:05:06.000Z"),
      },
    },
  },
};

const mockReport4: Report = {
  id: "12346",
  type: "report",
  attributes: mockAtt1,
  relationships: {
    severity: {
      rating: "high",
    },
    weakness: {
      id: "1234",
      attributes: {
        name: "Manipulation During Distribution",
        description:
          "An attacker undermines the integrity of a product, software, or technology at some stage of the distribution channel.",
        created_at: new Date("2016-02-02T04:05:06.000Z"),
        external_id: "capec-439",
      },
    },
  },
};

const mockReport5: Report = {
  id: "12347",
  type: "report",
  attributes: mockAtt1,
  relationships: {
    severity: {
      rating: "high",
    },
    weakness: {
      id: "1234",
      attributes: {
        name: "unknown",
        description: "unknown",
        created_at: new Date("2016-02-02T04:05:06.000Z"),
        external_id: "unknown-439",
      },
    },
  },
};

const mockReports: Report[][] = [
  [mockReport1, mockReport2, mockReport3, mockReport4, mockReport5],
];

export default {
  queryReports: jest.fn().mockResolvedValue(mockReports),
  verifyAccess: jest.fn(),
};
