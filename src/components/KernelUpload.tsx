"use client";

// React Imports
import { FC, useState } from "react";
import { Dropzone, ExtFile, FileMosaic } from "@files-ui/react";

// Next.js Imports
import { useRouter } from "next/navigation";

interface KernelUploadProps {}

const KernelUpload: FC<KernelUploadProps> = () => {
  const router = useRouter();
  const [files, setFiles] = useState<ExtFile[]>([]);

  const updateFiles = (incomingFiles: ExtFile[]) => {
    setFiles(incomingFiles);
  };

  return (
    <div className="flex flex-col">
      <p className="py-6">
        Upload a <span className="font-semibold">Kernel</span> (file) to get
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
        onUploadFinish={(res) => {
          console.log(res);
          router.push(`/granary`);
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

export default KernelUpload;
