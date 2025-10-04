import type { DataRow } from "./App";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { formatCurrency, isAmount } from "./utils";

const TableData = ({
  data,
  headers,
}: {
  data: DataRow[];
  headers: string[];
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((header) => (
            <TableHead
              key={header}
              className={`font-bold text-gray-400 ${
                isAmount(header) ? "text-right" : ""
              }`}
            >
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, i) => (
          <TableRow key={`row${i}`}>
            {headers.map((header) => (
              <TableCell
                key={header}
                className={`py-3 ${
                  isAmount(header) ? "text-right font-semibold" : ""
                }`}
              >
                {isAmount(header) ? formatCurrency(row[header]) : row[header]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableData;
