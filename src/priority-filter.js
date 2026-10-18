// Priority values are defined by the existing request form and validation rules.
export const HIGHEST_PRIORITY = "High";

export function priorityStatus(request) {
  if (typeof request?.priority !== "string" || !request.priority.trim()) {
    return "Missing priority";
  }
  return ["Low", "Medium", "High"].includes(request.priority)
    ? request.priority
    : "Invalid priority";
}

export function filterRequests(requests, highestOnly = false) {
  if (!Array.isArray(requests)) throw new TypeError("Requests must be an array.");
  return highestOnly
    ? requests.filter((request) => priorityStatus(request) === HIGHEST_PRIORITY)
    : [...requests];
}

export function duplicateIds(requests) {
  const counts = new Map();
  for (const request of requests) {
    if (typeof request?.id === "string") counts.set(request.id, (counts.get(request.id) ?? 0) + 1);
  }
  return new Set([...counts].filter(([, count]) => count > 1).map(([id]) => id));
}
