"use client";

import { Card, CardContent, CardActionArea, Typography, Stack } from "@mui/material";
import type { SelectFile } from "@src/server/db/models";

export default function FileCard({ file }: { file: SelectFile }) {
  return (
    <Card variant="outlined">
      <CardActionArea onClick={() => console.log("open file", file.id)}>
        <CardContent>
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" noWrap title={file.id}>
              {file.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {file.authorId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {file.sectionId}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}