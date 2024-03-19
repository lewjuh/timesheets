import { DateRange, IsFullDay } from "@/lib/calendar/types";
import { Badge, Table } from "@radix-ui/themes";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";

export default function DateTable({ dates }: { dates: DateRange[] }) {
  return (
    <Table.Root variant="ghost">
      <Table.Body>
        <AnimatePresence mode="sync">
          {dates.map((range) => (
            <motion.tr
              key={range.id}
              className="block [text-wrap:balance]"
              style={{ overflow: "hidden" }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Table.RowHeaderCell className="inline-block w-3/4">
                {format(range.start.date, "dd/MM/yyyy")}
                {range.end && " - "}
                {range.end && format(range.end.date, "dd/MM/yyyy")}
              </Table.RowHeaderCell>
              <Table.Cell className="inline-block w-1/4">
                {IsFullDay(range.start) ? (
                  <Badge color="green">Full</Badge>
                ) : (
                  <Badge color="iris">Half</Badge>
                )}
              </Table.Cell>
            </motion.tr>
          ))}
        </AnimatePresence>
      </Table.Body>
    </Table.Root>
  );
}
