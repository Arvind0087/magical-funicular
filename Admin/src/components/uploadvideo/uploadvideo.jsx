import { useCallback } from "react";
import { useState } from "react";
import { Upload } from "../../../../components/upload";

export default function ProductNewEditForm() {
  const [videos, setVideos] = useState([]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setVideos([...videos, ...newFiles]);
    },
    [setVideos, videos]
  );

  return (
    <Upload
      multiple
      name="videos"
      accept={{ "video/*": [] }}
      files={videos}
      onDrop={handleDrop}
      maxSize={3145728000000000}
    />
  );
}
