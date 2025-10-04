import type React from "react";
import { FileWarning, Upload } from "lucide-react";
import { Button } from "./components/ui/button";
import { useMemo, useState } from "react";
import Papa from "papaparse";
import { Card } from "./components/ui/card";
import { CONFIG } from "./config";
import TableData from "./table-data";
import CategoryFilter from "./CategoryFilter";

export interface DataRow {
  [key: string]: any;
}

export interface ParsedData {
  headers: string[];
  rows: DataRow[];
  categoryHeader: string;
  amountHeader: string;
}

function App() {
  const [data, setData] = useState<ParsedData | null>(null);
  const [filter, setFilter] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  console.log(data);

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          console.log(results);

          // Check if the file has data
          if (!results.data.length) {
            setError("CSV file has no data rows");
            return;
          }

          const headers = results.meta.fields || [];

          //Check for 'category' and 'amount' columns
          const headerLower = headers.map((h) => h.toLocaleLowerCase().trim());
          const categoryIndex = headerLower.indexOf(CONFIG.categoryColumn);
          const amountIndex = headerLower.indexOf(CONFIG.amountColumn);

          if (categoryIndex === -1 || amountIndex === -1) {
            setError(
              `CSV file must contain "${CONFIG.categoryColumn}" and "${CONFIG.amountColumn}" columns`
            );
            return;
          }

          const categoryHeader = headers[categoryIndex];
          const amountHeader = headers[amountIndex];

          //Validate data consistency
          const rows: DataRow[] = [];
          const firstRowLength = Object.keys(results.data[0] as object).length;

          for (let i = 0; i < results.data.length; i++) {
            const row = results.data[i] as DataRow;
            const currentRowNumber = i + 2;

            //Check column consistency
            if (Object.keys(row).length !== firstRowLength) {
              setError(
                `Row ${currentRowNumber} has inconsistent number of columns`
              );
              return;
            }

            //Validate category data type
            if (
              typeof row[categoryHeader] !== "string" ||
              row[categoryHeader].trim() === ""
            ) {
              setError(
                `Row ${currentRowNumber}: ${CONFIG.categoryColumn} must be a non-empty string`
              );
              return;
            }

            //Validate amount data type: should be a number
            if (
              typeof row[amountHeader] !== "number" ||
              isNaN(row[amountHeader])
            ) {
              setError(
                `Row ${currentRowNumber}: ${CONFIG.amountColumn} must be a valid number`
              );
              return;
            }

            rows.push(row);
          }

          setData({ headers, rows, categoryHeader, amountHeader });
          setError("");
          setFilter([]);
        } catch (err) {
          setError("Failed to read CSV file.");
        }
      },
      error: () => {
        setError("Failed to read CSV file.");
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".csv")) {
        setError("Invalid file type. Please upload CSV file.");
        return;
      }
      setFileName(file.name);
      setData(null);
      parseCSV(file);
    }
  };

  const availableCategories = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.rows.map((row) => row[data.categoryHeader]))];
  }, [data]);

  const toggleFilter = (f: string) => {
    setFilter((prev) =>
      prev.includes(f) ? prev.filter((pf) => pf !== f) : [...prev, f]
    );
  };

  const getFilteredRows = (): DataRow[] => {
    if (!data) return [];
    if (!filter.length) return data.rows;
    return data.rows.filter((row) => filter.includes(row[data.categoryHeader]));
  };

  const exportFilteredData = () => {
    if (!data) return;
    const filtered = getFilteredRows();
    const csv = Papa.unparse({
      fields: data.headers,
      data: filtered,
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName.replace(".csv", "")}-filtered.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredRows = getFilteredRows();

  const totalAmounts = data
    ? filteredRows.reduce(
        (sum, row) => sum + (row[data?.amountHeader] as number),
        0
      )
    : 0;

  return (
    <>
      <header className="flex justify-between py-3 px-5 bg-foreground text-background items-center">
        <h1 className="font-bold text-xl">ExpenseFilter</h1>
        <Button variant="secondary" size="sm" asChild>
          <label htmlFor="upload-csv">
            <Upload /> Upload CSV
          </label>
        </Button>
      </header>
      <input
        type="file"
        accept=".csv"
        id="upload-csv"
        name="upload-csv"
        onChange={handleFileUpload}
        className="hidden"
      />

      {(error || !data) && (
        <div className="h-[80vh] flex flex-col items-enter justify-center">
          {error && (
            <div className="text-rose-600 text-center">
              <FileWarning className="w-20 h-20 m-auto" />
              <h3 className="text-xl font-semibold my-5">{fileName}</h3>
              <p>{error}.</p>
            </div>
          )}

          {!data && !error && (
            <label
              htmlFor="upload-csv"
              className="opacity-50 text-center m-auto max-w-md p-4 hover:opacity-100"
            >
              <Upload className="w-20 h-20 m-auto" />
              <h3 className="text-xl font-semibold my-5">
                Upload your CSV file to start
              </h3>
              <p>
                Make sure your csv file includes a header row with at least the{" "}
                <strong>{CONFIG.categoryColumn}</strong> and{" "}
                <strong>{CONFIG.amountColumn}</strong> columns.
              </p>
            </label>
          )}
        </div>
      )}

      {data && (
        <>
          <main className="p-5">
            <CategoryFilter
              availableCategories={availableCategories}
              filter={filter}
              resetFilter={() => setFilter([])}
              toggleFilter={toggleFilter}
              totalFiltered={filteredRows.length}
              totalData={data.rows.length}
              totalAmounts={totalAmounts}
            />
            <Card className="p-2">
              <TableData data={filteredRows} headers={data.headers} />
            </Card>
          </main>

          {filter.length > 0 && (
            <div className="sticky bottom-0 backdrop-blur-sm bg-slate-100/50 p-5 border-t text-center">
              <Button
                size="lg"
                className="bg-lime-600 hover:bg-lime-500 m-auto"
                onClick={exportFilteredData}
              >
                Download Filtered Data ({filteredRows.length})
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default App;
