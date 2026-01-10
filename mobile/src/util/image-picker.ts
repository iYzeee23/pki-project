import * as ImagePicker from "expo-image-picker";

export type UploadFile = {
    uri: string;
    name: string;
    type: string;
};

function getExt(uri: string) {
    const lower = uri.toLowerCase();
    if (lower.includes(".png")) return "png";
    if (lower.includes(".webp")) return "webp";
    if (lower.includes(".heic")) return "heic";
    return "jpg";
}

function toUploadFile(a: ImagePicker.ImagePickerAsset, index = 0) {
    const uri = a.uri;
    const type = a.mimeType ?? "image/jpeg";
    const ext = getExt(uri);

    const res = { uri: uri, type: type, name: `image_${index}.${ext}` };
    return res as UploadFile;
}

async function pickImages(opts: { limit: number }) {
  const data = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsMultipleSelection: opts.limit > 1,
    quality: 1.0,
    selectionLimit: opts.limit,
  });

  const res = data.canceled ? [] : data.assets.map((a, i) => toUploadFile(a, i));
  return res as UploadFile[];
}

export async function pickSingleImage() {
  const files = await pickImages({ limit: 1 });
  return files[0];
}

export async function pickMultipleImages() {
  const files = await pickImages({ limit: 5 });
  return files;
}
