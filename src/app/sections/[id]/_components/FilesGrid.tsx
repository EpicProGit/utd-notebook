"use client";

import { Grid } from "@mui/material";
import FileCard from "./FileCard";
import type { SelectFile } from "@src/server/db/models";

export default function FilesGrid({ files }: { files: SelectFile[] }) {
    if (files.length === 0) {
        return <div>No files in this section yet.</div>;
    }
    return (
        <Grid container spacing={2} columns={4}>
            {files.map(f => (
                <Grid key={f.id}>
                    <FileCard file={f} />
                </Grid>
            ))}
        </Grid>
    );
}