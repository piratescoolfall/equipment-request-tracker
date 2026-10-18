import {
  RequestValidationError,
  appendRequest,
  createRequest,
  loadRequests,
  saveRequests,
} from "./request-store.js";
import { filterRequests, priorityStatus } from "./priority-filter.js";

const form = document.querySelector("#request-form");
const message = document.querySelector("#form-message");
const neededByInput = document.querySelector("#needed-by");
const count = document.querySelector("#request-count");
const emptyState = document.querySelector("#empty-state");
const tableWrapper = document.querySelector("#request-table-wrapper");
const tableBody = document.querySelector("#request-table-body");
const filterSelect = document.querySelector("#priority-filter");
const listMessage = document.querySelector("#list-message");
let highestOnly = false;

filterSelect.addEventListener("change", () => {
  highestOnly = filterSelect.value === "high";
  renderRequests();
});

let requests;
try {
  requests = loadRequests();
} catch (error) {
  requests = [];
  listMessage.textContent = "Requests could not be loaded. Existing stored data has not been changed.";
  console.error(error);
}

neededByInput.min = new Date().toISOString().slice(0, 10);
renderRequests();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearFieldErrors();
  setMessage("");

  const input = Object.fromEntries(new FormData(form).entries());

  try {
    const request = createRequest(input);
    requests = appendRequest(requests, request);
    saveRequests(requests);
    form.reset();
    neededByInput.min = new Date().toISOString().slice(0, 10);
    setMessage("Request added.");
    renderRequests();
    document.querySelector("#requester").focus();
  } catch (error) {
    if (error instanceof RequestValidationError) {
      showFieldErrors(error.errors);
      setMessage("Complete all required fields.", true);
      return;
    }

    setMessage("The request could not be saved. Try again.", true);
    console.error(error);
  }
});

function renderRequests() {
  try {
    const visible = filterRequests(requests, highestOnly);
    count.textContent = `${visible.length} ${visible.length === 1 ? "request" : "requests"}`;
    emptyState.hidden = visible.length > 0;
    tableWrapper.hidden = visible.length === 0;
    emptyState.querySelector("h3").textContent = highestOnly ? "No highest-priority requests" : "No requests yet";
    emptyState.querySelector("p").textContent = highestOnly
      ? "Switch to All Requests to see the full list."
      : "Add the first equipment request using the form.";
    tableBody.replaceChildren(...visible.map(createRequestRow));
  } catch (error) {
    listMessage.textContent = "The request list could not be filtered. Existing requests have not been changed.";
    console.error(error);
  }
}

function createRequestRow(request) {
  const row = document.createElement("tr");
  const values = [
    request.requester,
    request.department,
    request.equipment,
    priorityStatus(request),
    formatDate(request.neededBy),
    request.reason,
    formatDateTime(request.createdAt),
  ];

  for (const value of values) {
    const cell = document.createElement("td");
    cell.textContent = value;
    row.append(cell);
  }

  return row;
}

function formatDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function formatDateTime(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function showFieldErrors(errors) {
  const firstInvalidField = Object.keys(errors)[0];

  for (const fieldName of Object.keys(errors)) {
    form.elements[fieldName]?.setAttribute("aria-invalid", "true");
  }

  form.elements[firstInvalidField]?.focus();
}

function clearFieldErrors() {
  for (const element of form.elements) {
    element.removeAttribute?.("aria-invalid");
  }
}

function setMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}
