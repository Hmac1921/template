import { useMemo, useState } from "react";

import "./App.css";
import { Button, DataTable, Input, PageHeader } from "./design-system";
import type { ColumnProps } from "./design-system/molecules/data-table/data-table-types";

type DeliveryTask = {
  id: string;
  owner: string;
  priority: "High" | "Low" | "Medium";
  stage: string;
  summary: string;
  task: string;
  updatedAt: string;
};

const deliveryTasks: DeliveryTask[] = [
  {
    id: "task-101",
    owner: "Amira Boyd",
    priority: "High",
    stage: "Blocked",
    summary: "Payments dialog still fails keyboard escape handling in the approval flow.",
    task: "Payments approval modal",
    updatedAt: "2026-04-12 09:42",
  },
  {
    id: "task-102",
    owner: "Kian Ortega",
    priority: "Medium",
    stage: "In review",
    summary: "Command palette now uses a reducer-backed interaction model and typeahead.",
    task: "Command palette refactor",
    updatedAt: "2026-04-12 13:25",
  },
  {
    id: "task-103",
    owner: "Lena Fischer",
    priority: "Low",
    stage: "Ready",
    summary: "Add inline validation messaging and disabled styles to profile forms.",
    task: "Profile settings form",
    updatedAt: "2026-04-11 16:14",
  },
  {
    id: "task-104",
    owner: "Noah Kim",
    priority: "High",
    stage: "In progress",
    summary: "Resizing behavior is moving out of ad hoc DOM listeners into a shared hook.",
    task: "Split pane primitive",
    updatedAt: "2026-04-13 08:05",
  },
  {
    id: "task-105",
    owner: "Sofia Lund",
    priority: "Medium",
    stage: "Done",
    summary: "Search results now preserve focus order after async result updates.",
    task: "Search results accessibility",
    updatedAt: "2026-04-10 11:58",
  },
];

const taskColumns: ColumnProps<DeliveryTask>[] = [
  {
    field: "task",
    header: "Task",
  },
  {
    field: "owner",
    header: "Owner",
  },
  {
    field: "stage",
    header: "Stage",
  },
  {
    field: "priority",
    header: "Priority",
  },
  {
    field: "updatedAt",
    header: "Updated",
  },
];

function App() {
  const [query, setQuery] = useState("");

  const filteredTasks = useMemo(() => {
    if (!query.trim()) {
      return deliveryTasks;
    }

    const needle = query.toLowerCase();
    return deliveryTasks.filter((task) =>
      [task.task, task.owner, task.stage, task.summary, task.priority]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [query]);

  return (
    <main className="min-h-screen bg-[--surface-muted] px-6 py-12 text-[--ink]">
      <div className="mx-auto max-w-6xl space-y-8">
        <PageHeader
          title="Component library"
          subtitle="Design-system-first, accessibility-minded, and tuned for configurable density and typography."
          actions={<Button variant="primary">Launch demo</Button>}
        />

        <section className="rounded-[--radius-xl] border border-[--border] bg-[--surface] p-6 shadow-[--shadow-card]">
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[--brand]">
                Data table
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[--ink]">
                Delivery readiness board
              </h2>
            </div>
            <div className="w-full max-w-sm">
              <Input
                label="Filter tasks"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search task, owner, or stage"
              />
            </div>
          </div>

          <DataTable
            columns={taskColumns}
            data={filteredTasks}
            showPagination
            renderToolbar={({ filters, onFiltersChange }) => (
              <div className="flex w-full flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-[--ink-muted]">
                  {filteredTasks.length} rows visible
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onFiltersChange({})}
                  disabled={Object.keys(filters).length === 0}
                >
                  Reset filters
                </Button>
              </div>
            )}
          />
        </section>
      </div>
    </main>
  );
}

export default App;
  {
    id: "review",
    label: "Review",
    timestamp: "2026-04-13T10:10:00Z",
  },
];

const auditFindings = [
  {
    description:
      "The library had no shared action primitive, which forces each feature to restyle its own buttons and loading states.",
    title: "Missing action surface",
  },
  {
    description:
      "There was no accessible overlay primitive for confirmations, editors, or release flows, so keyboard-safe modals had to be rebuilt ad hoc.",
    title: "Missing modal pattern",
  },
  {
    description:
      "There was no compound view-switching primitive, leaving tabbed interfaces and segmented workflows without a reusable keyboard model.",
    title: "Missing tab system",
  },
];

const libraryStrengths = [
  "Input is typed and exposes a real label, hint, and error relationship.",
  "Table is reducer-driven, sortable, semantic, and keyboard navigable.",
  "Resizable and timeline slider both use shared hook-driven interaction models.",
];

const releaseChecklist = [
  "Document each public prop surface with short usage examples.",
  "Add a library entry file so consumers can import stable public exports.",
  "Start adding focused interaction tests for reducer-driven components.",
];

function getPriorityBadgeClassName(priority: DeliveryTask["priority"]) {
  switch (priority) {
    case "High":
      return "bg-rose-100 text-rose-700";
    case "Medium":
      return "bg-amber-100 text-amber-700";
    case "Low":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getStageBadgeClassName(stage: string) {
  switch (stage) {
    case "Blocked":
      return "bg-rose-100 text-rose-700";
    case "In progress":
      return "bg-sky-100 text-sky-700";
    case "In review":
      return "bg-violet-100 text-violet-700";
    case "Done":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function App() {
  const [query, setQuery] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(deliveryTasks[0]?.id ?? "");
  const [timelinePoints, setTimelinePoints] =
    useState<TimelineSliderPoint[]>(initialTimelinePoints);
  const deferredQuery = useDeferredValue(query);

  const filteredTasks = deliveryTasks.filter((task) => {
    const haystack = `${task.task} ${task.owner} ${task.stage} ${task.summary}`.toLowerCase();
    return haystack.includes(deferredQuery.trim().toLowerCase());
  });

  const selectedTask =
    deliveryTasks.find((task) => task.id === selectedTaskId) ?? filteredTasks[0] ?? null;

  return (
    <main className="app-shell">
      <section className="app-hero">
        <div>
          <p className="app-eyebrow">React 19 Component Library</p>
          <h1>Accessible, reducer-driven components with compound APIs.</h1>
        </div>
        <p className="app-intro">
          The demo below exercises keyboard focus, compound composition, reducer-based
          interaction state, and hook extraction across the library primitives.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.9fr)]">
        <Resizable.Root
          className="rounded-[32px] border border-slate-200 bg-white/80 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur"
          defaultWidth={720}
          label="Task data panel"
          maxWidth={920}
          minWidth={360}
        >
          <Resizable.Panel className="pr-4">
            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                  Compound Table
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Delivery readiness board
                </h2>
              </div>
              <div className="w-full max-w-sm">
                <Input
                  hint="Filtering uses startTransition and useDeferredValue to keep interactions responsive."
                  label="Filter tasks"
                  placeholder="Search by task, owner, stage or summary"
                  value={query}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    startTransition(() => {
                      setQuery(nextValue);
                    });
                  }}
                />
              </div>
            </div>

            <Table.Root
              caption="Delivery readiness tasks"
              columns={taskColumns}
              data={filteredTasks}
              defaultSortColumnId="updatedAt"
              getRowId={(row) => row.id}
              getRowLabel={(row) => `${row.task}, ${row.stage}, owned by ${row.owner}`}
              onRowAction={(row) => setSelectedTaskId(row.id)}
            >
              <Table.Header />
              <Table.Body emptyMessage="No tasks matched the current filter.">
                {(row: DeliveryTask, rowIndex) => (
                  <Table.Row row={row} rowIndex={rowIndex}>
                    <Table.Cell emphasized>{row.task}</Table.Cell>
                    <Table.Cell>{row.owner}</Table.Cell>
                    <Table.Cell>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStageBadgeClassName(
                          row.stage,
                        )}`}
                      >
                        {row.stage}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getPriorityBadgeClassName(
                          row.priority,
                        )}`}
                      >
                        {row.priority}
                      </span>
                    </Table.Cell>
                    <Table.Cell align="end">{row.updatedAt}</Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          </Resizable.Panel>

          <Resizable.Handle />

          <aside className="flex min-w-0 flex-1 flex-col gap-4 pl-4">
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Focused task
              </p>
              {selectedTask ? (
                <div className="mt-3 space-y-3">
                  <h3 className="text-xl font-semibold text-slate-900">
                    {selectedTask.task}
                  </h3>
                  <p className="text-sm leading-6 text-slate-600">{selectedTask.summary}</p>
                  <div className="grid gap-3">
                    <Input isDisabled label="Owner" value={selectedTask.owner} />
                    <Input isDisabled label="Stage" value={selectedTask.stage} />
                    <Input isDisabled label="Last updated" value={selectedTask.updatedAt} />
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">Select a task to inspect it.</p>
              )}
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-slate-100">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
                Keyboard map
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>Table rows: arrow keys, home/end, enter and space.</li>
                <li>Resizable handle: left/right arrows, page up/down, home and end.</li>
                <li>Timeline thumbs: arrows, page up/down, home and end.</li>
              </ul>
            </div>
          </aside>
        </Resizable.Root>

        <Slider
          end="2026-04-13T11:00:00Z"
          label="Refactor delivery timeline"
          points={timelinePoints}
          start="2026-04-13T07:45:00Z"
          stepInSeconds={300}
          onChange={setTimelinePoints}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Tabs.Root defaultValue="audit">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              Audit Summary
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              High-value gaps are now covered with reusable primitives.
            </h2>
          </div>
          <Tabs.List aria-label="Library audit tabs">
            <Tabs.Trigger value="audit">Findings</Tabs.Trigger>
            <Tabs.Trigger value="added">Added now</Tabs.Trigger>
            <Tabs.Trigger value="next">Next step</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel value="audit">
              <div className="grid gap-3">
                {auditFindings.map((finding) => (
                  <article
                    key={finding.title}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <h3 className="text-base font-semibold text-slate-900">
                      {finding.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {finding.description}
                    </p>
                  </article>
                ))}
              </div>
            </Tabs.Panel>

            <Tabs.Panel value="added">
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-base font-semibold text-slate-900">
                    New components
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    `Button` now covers consistent action styling, `Tabs` provides
                    reducer-driven view switching, and `Dialog` adds a reusable overlay
                    pattern with escape and focus handling.
                  </p>
                </div>
                <div className="grid gap-2">
                  {libraryStrengths.map((strength) => (
                    <div
                      key={strength}
                      className="rounded-2xl bg-slate-950 px-4 py-3 text-sm text-slate-200"
                    >
                      {strength}
                    </div>
                  ))}
                </div>
              </div>
            </Tabs.Panel>

            <Tabs.Panel value="next">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-base font-semibold text-slate-900">
                  Recommended follow-up
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  {releaseChecklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button>Ship docs pass</Button>
                  <Button variant="secondary">Add test harness</Button>
                </div>
              </div>
            </Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>

        <Dialog.Root>
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              Overlay Primitive
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Dialog fills the missing confirmation and workflow layer.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The dialog supports focus trapping, escape to close, click-away dismissal,
              and a compound API for title, body, and footer composition.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Dialog.Trigger className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">
                Open release checklist
              </Dialog.Trigger>
              <Button variant="secondary">Preview tokens</Button>
            </div>
          </div>

          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Header>
              <div>
                <Dialog.Title>Library release checklist</Dialog.Title>
                <Dialog.Description>
                  Use this dialog as the baseline pattern for approvals, destructive
                  confirmations, and small workflow forms.
                </Dialog.Description>
              </div>
              <Dialog.Close className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-900">
                x
              </Dialog.Close>
            </Dialog.Header>

            <Dialog.Body>
              <div className="grid gap-3">
                {releaseChecklist.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.Close className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">
                Close
              </Dialog.Close>
              <Button>Approve release</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      </section>
    </main>
  );
}

export default App;
