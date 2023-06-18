"use client";

// React Imports
import { FC, useEffect, useState } from "react";
import axios from "axios";
import { Dropzone, ExtFile, FileMosaic } from "@files-ui/react";
import { useRouter } from "next/navigation";

interface KernelUploadProps {}

const KernelUpload: FC<KernelUploadProps> = () => {
  const router = useRouter();
  const [kernelId, setKernelId] = useState(null);
  const [uploadAnimationFinished, setUploadAnimationFinished] = useState(false);
  const [files, setFiles] = useState<ExtFile[]>([]);

  useEffect(() => {
    if (uploadAnimationFinished && kernelId) {
      router.push(`/kernel/${kernelId}`);
    }
  }, [router, uploadAnimationFinished, kernelId]);

  const updateFiles = (incomingFiles: ExtFile[]) => {
    setFiles(incomingFiles);
  };

  const upload = async () => {
    if (files.length < 1) {
      throw new Error("Must have exactly 1 file to upload.");
    }
    if (!files[0].file) {
      throw new Error("files[0] has no file value.");
    }

    const formData = new FormData();
    formData.append("file", files[0].file);
    const { data } = await axios.post("/api/createKernel", formData);
    setKernelId(data.kernel_id);
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
        fakeUpload
        onUploadStart={upload}
        onUploadFinish={() => setUploadAnimationFinished(true)}
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
