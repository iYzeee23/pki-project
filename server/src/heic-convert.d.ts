declare module "heic-convert" {
  type HeicConvertArgs = {
    buffer: Buffer | Uint8Array;
    format: "PNG" | "JPG" | "JPEG";
    quality?: number;
  };

  export default function heicConvert(args: HeicConvertArgs): Promise<Buffer>;
}
