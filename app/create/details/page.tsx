"use client";
import "react-day-picker/dist/style.css";

import { Card, Text, Box, Flex, Heading, Table, Grid } from "@radix-ui/themes";

import { DateWithType } from "@/lib/calendar/types";

export default function Create() {
  const initialDays: DateWithType[] = [];

  return (
    <Flex gap="3" direction="column" className="w-full max-w-3xl">
      <Flex gap="3" direction="column" className="w-full">
        <Box className="w-full">
          <Heading
            color="crimson"
            size="6"
            align="left"
            className="animate-fade-up opacity-0 [text-wrap:balance]"
            style={{ animationDelay: "0s", animationFillMode: "forwards" }}
          >
            Details
          </Heading>
        </Box>
        <Box className="w-5/6">
          <Text
            as="p"
            size="3"
            align="left"
            className="animate-fade-up opacity-0 [text-wrap:balance]"
            style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
          >
            {`Select the dates you want to add to the timesheet. Use the toggle to select if the day is a full day or half day.`}
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}
