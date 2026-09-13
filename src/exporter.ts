// CSV export pipeline.
// Serializes report rows using the report's saved column order.

type CsvValue = string | number;

export type CsvExport = {
  columns: string[];
  csv: string;
};

function csvEscape(field: CsvValue): string {
  const s = String(field);
  return s.includes(",") || s.includes('"') || s.includes("\n")
    ? `"${s.replace(/"/g, '""')}"`
    : s;
}

function toCsv(columns: string[], rows: CsvValue[][]): string {
  const lines = [
    columns.map(csvEscape).join(","),
    ...rows.map((row) => row.map(csvEscape).join(",")),
  ];
  return lines.join("\n");
}

/**
 * Serialize rows to CSV. `columns` is the report's saved column order;
 * `rows` are keyed by column name.
 */
export function exportCsv(
  rows: Record<string, CsvValue>[],
  columns: string[],
): CsvExport {
  // Preserve the saved column order — see RET-047
  const outputColumns = [...columns];
  const orderedRows = rows.map((row) =>
    outputColumns.map((col) => row[col] ?? ""),
  );
  return { columns: outputColumns, csv: toCsv(outputColumns, orderedRows) };
}
