"use client";
import { DayPicker, Matcher } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useState } from "react";
import { format, isAfter, isBefore, isSameDay } from "date-fns";
import style from "./style.module.css";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import {
  ChevronRightIcon,
  SquareIcon,
  ViewHorizontalIcon,
} from "@radix-ui/react-icons";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  Card,
  Text,
  Box,
  Flex,
  Heading,
  Table,
  Grid,
  Button,
} from "@radix-ui/themes";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { DateWithType, DayType } from "../../lib/calendar/types";
import DateTable from "@/components/calendar/date-table";
import useDateState from "@/lib/hooks/use-date-state";
import { datesWithTypeAsDates } from "@/lib/utils/days";
import { AnimatePresence, m, motion } from "framer-motion";

const toggleGroupItemClasses =
  "relative bg-white color-mauve11 hover:bg-violet2 flex h-[35px] w-[35px] items-center justify-center text-base leading-4  focus:z-10 focus:shadow-[0_0_0_2px] focus:z-10 focus:shadow-black focus:outline-none";

const toggleGroupItemClassesFull =
  "rounded-l hover:text-green9 data-[selected=true]:bg-green9 data-[selected=true]:text-green4 data-[selected=true]:hover:bg-green8 data-[selected=true]:hover:text-green3";

const toggleGroupItemClassesHalf =
  "rounded-r hover:text-iris9 data-[selected=true]:bg-iris9 data-[selected=true]:text-iris4 data-[selected=true]:hover:bg-iris8 data-[selected=true]:hover:text-iris3";

export default function Create() {
  const initialDays: DateWithType[] = [];

  const {
    days,
    dayType,
    handleSelectDate,
    daysWithRanges,
    isDayType,
    setDayType,
    isDateTypeFullDay,
    isDateTypeHalfDay,
    isStartOfRange,
    isEndOfRange,
    isMiddleOfRange,
  } = useDateState(initialDays);

  const isDateHalfDay: Matcher = (date: Date) => isDayType(date, DayType.Half);

  const isDateFullDay: Matcher = (date: Date) => isDayType(date, DayType.Full);

  return (
    <AnimatePresence>
      <Flex gap="3" direction="column" className="w-full max-w-3xl">
        <Flex gap="3" direction="column" className="w-full">
          <Box className="w-full" asChild>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0 }}
            >
              <Heading
                color="crimson"
                size="6"
                align="left"
                className="[text-wrap:balance]"
              >
                Select Dates
              </Heading>
            </motion.div>
          </Box>
          <Box className="w-5/6" asChild>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.05 }}
            >
              <Text
                as="p"
                size="3"
                align="left"
                className="[text-wrap:balance]"
              >
                {`Select the dates you want to add to the timesheet. Use the toggle to select if the day is a full day or half day.`}
              </Text>
            </motion.div>
          </Box>
        </Flex>

        <Card size="2" style={{ maxWidth: 800 }} variant="surface" asChild>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Grid gap="3" columns="2" className="w-full [text-wrap:balance]">
              <Flex gap="3" direction="column" justify="start" align="start">
                <Box>
                  <ToggleGroup.Root
                    className="ml-5 mt-4 inline-flex space-x-px rounded bg-mauve6 shadow-[0_2px_6px] shadow-blackA4 "
                    type="single"
                    defaultValue={DayType.Full}
                    aria-label="Text alignment"
                    value={dayType}
                    onValueChange={(value) => {
                      if (value) setDayType(value as DayType);
                    }}
                  >
                    <Tooltip.Provider delayDuration={500}>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <ToggleGroup.Item
                            className={`${toggleGroupItemClasses} ${toggleGroupItemClassesFull}`}
                            value={DayType.Full}
                            data-selected={isDateTypeFullDay}
                          >
                            <SquareIcon width={20} />
                          </ToggleGroup.Item>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none text-green9 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
                            sideOffset={5}
                          >
                            Full Day
                            <Tooltip.Arrow className="fill-white" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>

                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <ToggleGroup.Item
                            className={`${toggleGroupItemClasses} ${toggleGroupItemClassesHalf}`}
                            value={DayType.Half}
                            data-selected={isDateTypeHalfDay}
                          >
                            <ViewHorizontalIcon />
                          </ToggleGroup.Item>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none text-iris9 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
                            sideOffset={5}
                          >
                            Half Day
                            <Tooltip.Arrow className="fill-white" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </ToggleGroup.Root>
                </Box>
                <Box>
                  <DayPicker
                    mode="multiple"
                    min={1}
                    selected={datesWithTypeAsDates(days)}
                    onDayClick={handleSelectDate}
                    modifiersClassNames={{
                      fullDay: style.fullDay,
                      halfDay: style.halfDay,
                      startOfRange: style.startOfRange,
                      endOfRange: style.endOfRange,
                      middleOfRange: style.middleOfRange,
                    }}
                    modifiers={{
                      fullDay: isDateFullDay,
                      halfDay: isDateHalfDay,
                      startOfRange: isStartOfRange,
                      endOfRange: isEndOfRange,
                      middleOfRange: isMiddleOfRange,
                    }}
                  />
                </Box>
              </Flex>
              <Flex justify="start" direction="column" className="w-full">
                <Table.Root variant="ghost" className="rounded-t-none">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell className="w-3/4">
                        Date
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell className="w-1/4">
                        Type
                      </Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                </Table.Root>

                <ScrollArea.Root
                  className="h-[355px] w-full overflow-hidden"
                  type="auto"
                >
                  <ScrollArea.Viewport className="h-full w-full ">
                    <DateTable dates={daysWithRanges} />
                  </ScrollArea.Viewport>
                  <ScrollArea.Scrollbar
                    className="flex touch-none select-none bg-blackA1 p-0.5 transition-colors duration-[160ms] ease-out hover:bg-blackA3 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
                    orientation="vertical"
                  >
                    <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-mauve10 before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']" />
                  </ScrollArea.Scrollbar>
                  <ScrollArea.Scrollbar
                    className="flex touch-none select-none bg-blackA3 p-0.5 transition-colors duration-[160ms] ease-out hover:bg-blackA5 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
                    orientation="horizontal"
                  >
                    <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-mauve10 before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']" />
                  </ScrollArea.Scrollbar>
                  <ScrollArea.Corner className="bg-blackA5" />
                </ScrollArea.Root>
              </Flex>
            </Grid>
          </motion.div>
        </Card>
        <Flex justify="end" className="w-full">
          <Button
            color="crimson"
            variant="soft"
            className="w-52 cursor-pointer"
            size="4"
            asChild
            type="button"
            disabled={days?.length === 0}
          >
            <motion.button
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{
                opacity: { delay: 0.15 },
                x: { delay: 0.15 },
                scale: { duration: 0.15 },
              }}
              whileTap={days?.length !== 0 ? { scale: 0.95 } : {}}
              whileHover={days?.length !== 0 ? { scale: 1.05 } : {}}
            >
              Next
              <ChevronRightIcon width="16" height="16" />
            </motion.button>
          </Button>
        </Flex>
      </Flex>
    </AnimatePresence>
  );
}
