import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { CheckSquare2, Square } from "lucide-react";
import { formatCurrency } from "./utils";

type Props = {
  availableCategories: string[];
  filter: string[];
  resetFilter: () => void;
  toggleFilter: (cat: string) => void;
  totalFiltered: number;
  totalData: number;
  totalAmounts: number;
};

const CategoryFilter = ({
  availableCategories,
  filter,
  resetFilter,
  toggleFilter,
  totalAmounts,
  totalFiltered,
  totalData,
}: Props) => {
  return (
    <>
      {availableCategories.length > 1 && (
        <Card className="gap-0 mb-5 bg-slate-500 text-background">
          <CardHeader className="flex items-center justify-between border-b">
            <h2 className="font-medium text-lg">Categories:</h2>
            {filter.length > 0 ? (
              <Button
                variant="secondary"
                size="sm"
                className="bg-yellow-400 hover:bg-yellow-500"
                onClick={resetFilter}
              >
                Clear Filter ({filter.length})
              </Button>
            ) : (
              <small>Click categories to filter</small>
            )}
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 bg-gray-200 py-5">
            {availableCategories.map((category) => (
              <Button
                size="sm"
                variant={filter.includes(category) ? "default" : "secondary"}
                key={category}
                onClick={() => toggleFilter(category)}
              >
                {filter.includes(category) ? <CheckSquare2 /> : <Square />}
                {category}
              </Button>
            ))}
          </CardContent>
          <CardFooter className="border-t flex justify-between">
            <span>
              Items:{" "}
              <strong>
                {totalFiltered} of {totalData}
              </strong>
            </span>
            <span>
              Total Expense: <strong>{formatCurrency(totalAmounts)}</strong>
            </span>
          </CardFooter>
        </Card>
      )}

      {availableCategories.length === 1 && (
        <Card className="gap-0 p-0 overflow-clip text-center mb-5">
          <CardContent className="p-5">
            Your data contains only one category, so the filter feature is not
            needed.
          </CardContent>
          <CardFooter className="border-t p-6 text-background bg-slate-600 flex justify-between">
            <span>
              Items: <strong>{totalFiltered}</strong>
            </span>
            <span>
              Total Expense: <strong>{formatCurrency(totalAmounts)}</strong>
            </span>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default CategoryFilter;
