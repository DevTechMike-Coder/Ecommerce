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

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value
}) => {
  const onUpload = (result: { info: { secure_url: string } }) => {
    onChange(result.info.secure_url);
  };

  return ( 
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-2xl overflow-hidden border-2 border-primary/10 shadow-lg group">
            <div className="z-10 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
      <CldUploadWidget onUpload={onUpload} uploadPreset="Ecommerce">
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
              className="w-full h-32 border-dashed border-2 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 transition-colors rounded-2xl"
            >
              <ImagePlus className="h-8 w-8 text-primary" />
              <span className="font-semibold">Upload Product Images</span>
              <span className="text-xs text-muted-foreground uppercase tracking-widest">Recommended: 1080x1080px</span>
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}

export default ImageUpload;
