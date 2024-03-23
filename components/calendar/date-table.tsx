import { DateRange, IsFullDay } from "@/lib/calendar/types";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Badge, IconButton, Table } from "@radix-ui/themes";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { DateWithType } from "../../lib/calendar/types";

export default function DateTable({
  dates,
  onClickDelete,
}: {
  dates: DateRange[];
  onClickDelete: (dates: DateRange) => void;
}) {
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
              <Table.RowHeaderCell className="inline-block w-4/6">
                {format(range.start.date, "dd/MM/yyyy")}
                {range.end && " - "}
                {range.end && format(range.end.date, "dd/MM/yyyy")}
              </Table.RowHeaderCell>
              <Table.Cell className="inline-block w-1/6">
                {IsFullDay(range.start) ? (
                  <Badge color="green">Full</Badge>
                ) : (
                  <Badge color="iris">Half</Badge>
                )}
              </Table.Cell>
              <Table.Cell className="inline-grid w-1/6 content-center items-center justify-center">
                <IconButton
                  radius="full"
                  color="red"
                  variant="outline"
                  size="1"
                  onClick={() => onClickDelete(range)}
                >
                  <Cross2Icon width="18" height="18" />
                </IconButton>
              </Table.Cell>
            </motion.tr>
          ))}
        </AnimatePresence>
      </Table.Body>
    </Table.Root>
  );
}
