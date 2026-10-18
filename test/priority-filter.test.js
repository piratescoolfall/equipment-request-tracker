import test from "node:test";
import assert from "node:assert/strict";
import { filterRequests, priorityStatus } from "../src/priority-filter.js";

const records = [
  { id: "1", priority: "Low" },
  { id: "2", priority: "High" },
  { id: "3", priority: "Medium" },
  { id: "4" },
  { id: "5", priority: "Urgent" },
  { id: "6", priority: "High" },
  { id: "6", priority: "High" },
];

test("highest priority filters only High, retaining order and duplicates", () => {
  assert.deepEqual(filterRequests(records, true).map((r) => r.id), ["2", "6", "6"]);
});

test("all requests restores every record, including missing and invalid priority", () => {
  assert.deepEqual(filterRequests(records), records);
});

test("missing and invalid priorities are clearly classified", () => {
  assert.equal(priorityStatus({}), "Missing priority");
  assert.equal(priorityStatus({ priority: " " }), "Missing priority");
  assert.equal(priorityStatus({ priority: "Urgent" }), "Invalid priority");
  assert.equal(priorityStatus({ priority: "High" }), "High");
});

test("empty highest priority results do not mutate stored requests", () => {
  const input = [{ id: "1", priority: "Low" }];
  const snapshot = JSON.stringify(input);
  assert.deepEqual(filterRequests(input, true), []);
  assert.equal(JSON.stringify(input), snapshot);
});

test("switching filters never mutates or reorders original records", () => {
  const before = JSON.stringify(records);
  filterRequests(records, true);
  filterRequests(records, false);
  assert.equal(JSON.stringify(records), before);
});

test("unexpected invalid list input throws instead of modifying data", () => {
  assert.throws(() => filterRequests(null, true), TypeError);
});
