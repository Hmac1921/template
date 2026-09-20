import { type ReactNode, useCallback, useEffect, useMemo } from "react";

import { Table, useTableContext } from "./data-table-context";
import useRenderRows from "./table-hooks/use-render-rows";

import type { ColumnProps } from "./data-table-types";
import DataTablePagination from "./table-components/pagination";
import DataTableRowCountDropdown from "./table-components/row-count-dropdown";
import { ACTION_TYPES } from "./data-table.reducer";

export type DataTablePaginationState = {
  page: number;
  pageCount: number;
};

export type DataTableFilterMap<T extends Record<string, unknown>> = Partial<
  Record<keyof T, unknown>
>;

export type DataTableProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  columns?: ColumnProps<T>[];
  data?: T[];
  filterPredicate?: (row: T, filters: DataTableFilterMap<T>) => boolean;
  filters?: DataTableFilterMap<T>;
  getRowKey?: (row: T, index: number) => string | number;
  onFiltersChange?: (filters: DataTableFilterMap<T>) => void;
  onPaginationChange?: (payload: DataTablePaginationState) => void;
  pagination?: DataTablePaginationState;
  renderFilters?: (args: {
    filters: DataTableFilterMap<T>;
    onFiltersChange: (nextFilters: DataTableFilterMap<T>) => void;
  }) => ReactNode;
  renderPagination?: (args: {
    count: number;
    onPageChange: (payload: DataTablePaginationState) => void;
    payload: DataTablePaginationState;
  }) => ReactNode;
  renderToolbar?: (args: {
    filters: DataTableFilterMap<T>;
    onFiltersChange: (nextFilters: DataTableFilterMap<T>) => void;
  }) => ReactNode;
  showPagination?: boolean;
  toolbar?: ReactNode;
};

type DateRangeFilterValue = { start?: string; end?: string };

const isDateRangeFilterValue = (
  value: unknown,
): value is DateRangeFilterValue => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return "start" in value || "end" in value;
};

const isFilterEmpty = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return true;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (isDateRangeFilterValue(value)) {
    return !value.start && !value.end;
  }

  return false;
};

const parseDateValue = (value: unknown) => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === "string") {
    if (value.trim() === "") {
      return null;
    }

    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
    const date = new Date(isDateOnly ? `${value}T00:00:00` : value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
};

const parseDateInput = (value: string | undefined, isEnd?: boolean) => {
  if (!value) {
    return null;
  }

  const suffix = isEnd ? "T23:59:59.999" : "T00:00:00";
  const date = new Date(`${value}${suffix}`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const defaultFilterPredicate = <T extends Record<string, unknown>>(
  row: T,
  nextFilters: DataTableFilterMap<T>,
) => {
  for (const [key, value] of Object.entries(nextFilters)) {
    if (isFilterEmpty(value)) {
      continue;
    }

    const rowValue = row[key as keyof T];

    if (isDateRangeFilterValue(value)) {
      const rowDate = parseDateValue(rowValue);

      if (!rowDate) {
        return false;
      }

      const startDate = parseDateInput(value.start);
      const endDate = parseDateInput(value.end, true);

      if (startDate && rowDate < startDate) {
        return false;
      }

      if (endDate && rowDate > endDate) {
        return false;
      }
    } else if (typeof value === "string") {
      if (rowValue === null || rowValue === undefined) {
        return false;
      }

      if (!rowValue.toString().toLowerCase().includes(value.toLowerCase())) {
        return false;
      }
    } else if (Array.isArray(value)) {
      if (!value.includes(rowValue)) {
        return false;
      }
    } else if (rowValue !== value) {
      return false;
    }
  }

  return true;
};

export const DefaultDataTableFilters = <T extends Record<string, unknown>>({
  filters,
  onFiltersChange,
}: {
  filters: DataTableFilterMap<T>;
  onFiltersChange: (nextFilters: DataTableFilterMap<T>) => void;
}) => {
  if (!filters || Object.keys(filters).length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {Object.entries(filters).map(([key, value]) => (
        <div
          key={key}
          className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink"
        >
          {String(key)}: {String(value)}
        </div>
      ))}
      <button
        type="button"
        className="h-9 rounded-lg border border-border bg-surface px-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-surface-muted"
        onClick={() => onFiltersChange({})}
      >
        Clear
      </button>
    </div>
  );
};

export const DefaultDataTablePagination = <T extends Record<string, unknown>>({
  count,
  onPageChange,
  payload,
}: {
  count: number;
  onPageChange: (payload: DataTablePaginationState) => void;
  payload: DataTablePaginationState;
}) => {
  return (
    <Table.ToolbarPagination>
      <DataTableRowCountDropdown
        pageCount={payload.pageCount}
        onChange={({ pageCount }) => onPageChange({ page: 1, pageCount })}
      />
      <DataTablePagination
        payload={payload}
        count={count}
        onChange={(nextPayload) => onPageChange(nextPayload)}
      />
    </Table.ToolbarPagination>
  );
};

const DataTableRoot = <T extends Record<string, unknown>>({
  columns = [],
  data = [],
  filterPredicate,
  filters,
  getRowKey,
  onFiltersChange,
  onPaginationChange,
  pagination,
  renderFilters,
  renderPagination,
  renderToolbar,
  showPagination = true,
  toolbar,
}: DataTableProps<T>) => {
  const { state, dispatch } = useTableContext();
  const activePagination = pagination ?? state.pagination;
  const canUpdatePagination = Boolean(onPaginationChange) || !pagination;

  const activeFilters = (filters ?? state.filters) as DataTableFilterMap<T>;

  const handleFiltersChange = useCallback(
    (nextFilters: DataTableFilterMap<T>) => {
      onFiltersChange?.(nextFilters);

      if (filters === undefined) {
        dispatch({ type: ACTION_TYPES.SET_FILTERS, filters: nextFilters });
      }
    },
    [dispatch, filters, onFiltersChange],
  );

  const updatePagination = useCallback(
    (payload: DataTablePaginationState) => {
      onPaginationChange?.(payload);

      if (!pagination) {
        dispatch({ type: ACTION_TYPES.SET_PAGINATION, pagination: payload });
      }
    },
    [dispatch, onPaginationChange, pagination],
  );

  const filteredData = useMemo(() => {
    if (!activeFilters || Object.keys(activeFilters).length === 0) {
      return data;
    }

    return data.filter((row) =>
      filterPredicate
        ? filterPredicate(row, activeFilters)
        : defaultFilterPredicate(row, activeFilters),
    );
  }, [activeFilters, data, filterPredicate]);

  const lastPageNumber = Math.max(
    1,
    Math.ceil(filteredData.length / activePagination.pageCount),
  );

  const pagedData = useMemo(() => {
    const pageStart = (activePagination.page - 1) * activePagination.pageCount;
    const pageEnd = pageStart + activePagination.pageCount;
    return filteredData.slice(pageStart, pageEnd);
  }, [activePagination.page, activePagination.pageCount, filteredData]);

  useEffect(() => {
    if (!canUpdatePagination) {
      return;
    }

    if (activePagination.page > lastPageNumber) {
      updatePagination({ ...activePagination, page: lastPageNumber });
    }
  }, [activePagination, canUpdatePagination, lastPageNumber, updatePagination]);

  useEffect(() => {
    if (filters === undefined) {
      return;
    }

    dispatch({ type: ACTION_TYPES.SET_FILTERS, filters });
  }, [dispatch, filters]);

  useEffect(() => {
    if (!canUpdatePagination || filters === undefined) {
      return;
    }

    if (activePagination.page !== 1) {
      updatePagination({ ...activePagination, page: 1 });
    }
  }, [activePagination.page, canUpdatePagination, filters, updatePagination]);

  const toolbarContent = renderToolbar ? (
    renderToolbar({
      filters: activeFilters,
      onFiltersChange: handleFiltersChange,
    })
  ) : (
    <>
      {toolbar}
      {(renderFilters ?? DefaultDataTableFilters)({
        filters: activeFilters,
        onFiltersChange: handleFiltersChange,
      })}
    </>
  );

  return (
    <>
      <Table.Toolbar>{toolbarContent}</Table.Toolbar>
      <Table.Container columns={columns as ColumnProps[]}>
        <Table.Header>
          {columns.map((column, index) => (
            <Table.ColumnHeader
              key={String(column.field ?? index)}
              column={column as ColumnProps}
            >
              {column.header}
            </Table.ColumnHeader>
          ))}
        </Table.Header>
        <Table.Body>
          {useRenderRows(pagedData, columns).map((entry, index) => (
            <Table.Row
              key={
                getRowKey
                  ? String(getRowKey(entry.row as T, index))
                  : String(index)
              }
              cellData={entry.row}
            >
              {entry.columns.map((column, cellIndex) => (
                <Table.Cell key={`${String(index)}-${String(cellIndex)}`}>
                  {column.renderComponent}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Container>
      {showPagination &&
        (renderPagination ?? DefaultDataTablePagination)({
          count: filteredData.length,
          onPageChange: updatePagination,
          payload: activePagination,
        })}
    </>
  );
};

export const DataTable = Object.assign(
  <T extends Record<string, unknown> = Record<string, unknown>>(
    props: DataTableProps<T>,
  ) => (
    <Table>
      <DataTableRoot {...props} />
    </Table>
  ),
  {
    Body: Table.Body,
    Cell: Table.Cell,
    Container: Table.Container,
    Filters: DefaultDataTableFilters,
    Footer: Table.ToolbarPagination,
    Header: Table.Header,
    Pagination: DefaultDataTablePagination,
    Root: DataTableRoot,
    Row: Table.Row,
    Table: Table,
    Toolbar: Table.Toolbar,
    ToolbarPagination: Table.ToolbarPagination,
    ColumnHeader: Table.ColumnHeader,
  },
);

export default DataTable;
