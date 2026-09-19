import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import DataTable from "./data-table";

describe("DataTable", () => {
  it("Renders DataTable without throwing an error", () => {
    expect(() => render(<DataTable />)).not.toThrow();
  });
});
