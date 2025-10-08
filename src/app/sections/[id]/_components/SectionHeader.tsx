"use client";

import { Stack, Typography, Chip } from "@mui/material";

export default function SectionHeader(props: { title: string; fileCount: number }) {
  const { title, fileCount } = props;
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography variant="h4">{title}</Typography>
      <Chip label={`${fileCount} file${fileCount === 1 ? "" : "s"}`} />
    </Stack>
  );
}