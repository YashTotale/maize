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
    <div className="flex flex-col">
      <p className="py-6">
        Upload a <span className="font-semibold">Grain</span> (file) to get
        started!
      </p>
      <Dropzone
        onChange={updateFiles}
        value={files}
        uploadConfig={{
          url: "/api/createKernel",
          method: "POST",
          cleanOnUpload: true,
        }}
        actionButtons={{
          position: "after",
          uploadButton: {},
        }}
        maxFiles={1}
        maxFileSize={10 * 1024 * 1024}
        accept="text/plain"
        className="p-4"
      >
        {files.map((file, i) => (
          <FileMosaic key={i} {...file} preview />
        ))}
      </Dropzone>
    </div>
  );
};

export default GrainUpload;
