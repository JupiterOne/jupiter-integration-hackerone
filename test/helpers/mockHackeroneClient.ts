import { Report, ReportAttribute } from "../../src/converters";

const mockAtt1: ReportAttribute = {
  title: "Bad Finding",
  vulnerability_information: "This is information about the really bad thing.",
  state: "resolved",
};

const mockAtt2: ReportAttribute = {
  title: "Bad Finding 2",
  vulnerability_information: "This is information about a bad thing",
  state: "resolved",
};

const mockReport1: Report = {
  id: "12345",
  type: "report",
  attributes: mockAtt1,
};

const mockReport2: Report = {
  id: "67890",
  type: "report",
  attributes: mockAtt2,
};

const mockReports: Report[][] = [[mockReport1, mockReport2]];

export default {
  queryReports: jest.fn().mockResolvedValue(mockReports),
};
