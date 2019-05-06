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
  },
};

const mockReport2: Report = {
  id: "67890",
  type: "report",
  attributes: mockAtt2,
  relationships: {},
};

const mockReports: Report[][] = [[mockReport1, mockReport2]];

export default {
  queryReports: jest.fn().mockResolvedValue(mockReports),
  verifyAccess: jest.fn(),
};
