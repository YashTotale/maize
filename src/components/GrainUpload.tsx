"use client";

import { FC, useState } from "react";
import { Dropzone, ExtFile, FileMosaic } from "@files-ui/react";

interface GrainUploadProps {}

const GrainUpload: FC<GrainUploadProps> = () => {
  const [files, setFiles] = useState<ExtFile[]>([]);
  const updateFiles = (incomingFiles: ExtFile[]) => {
    setFiles(incomingFiles);
  };
  return (
    <Dropzone
      onChange={updateFiles}
      value={files}
      maxFiles={10}
      maxFileSize={10 * 1024 * 1024}
      accept=".txt"
      className="p-4"
    >
      {files.map((file, i) => (
        <FileMosaic key={i} {...file} preview />
      ))}
    </Dropzone>
  );
};

export default GrainUpload;
