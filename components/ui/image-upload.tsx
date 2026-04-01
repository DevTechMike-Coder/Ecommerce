"use client";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

type UploadResult = {
  info?: string | { secure_url?: string };
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value
}) => {
  const onUpload = (result: UploadResult) => {
    if (result.info && typeof result.info !== "string" && result.info.secure_url) {
      onChange(result.info.secure_url);
    }
  };

  return ( 
    <div>
      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {value.map((url) => (
          <div key={url} className="group relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-primary/10 shadow-lg">
            <div className="absolute top-2 right-2 z-10 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
              <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon" className="rounded-full w-8 h-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Product Image"
              src={url}
            />
          </div>
        ))}
      </div>
      {/* 
        NOTE: You may see a 'net::ERR_BLOCKED_BY_CLIENT' error in the console for 'rollbar.min.js'.
        This is caused by ad-blockers blocking Cloudinary's internal telemetry/tracking script.
        This is expected behavior and does not affect the functionality of the upload widget.
      */}
      <CldUploadWidget onSuccess={onUpload} uploadPreset="Ecommerce">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button 
              type="button" 
              disabled={disabled} 
              variant="outline" 
              onClick={onClick}
              className="h-32 w-full rounded-2xl border-2 border-dashed transition-colors hover:bg-primary/5 sm:h-36 flex flex-col items-center justify-center gap-2"
            >
              <ImagePlus className="h-8 w-8 text-primary" />
              <span className="font-semibold">Upload Product Images</span>
              <span className="text-center text-xs uppercase tracking-widest text-muted-foreground">
                Recommended: 1080x1080px
              </span>
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}

export default ImageUpload;
