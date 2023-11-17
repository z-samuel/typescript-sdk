export function isIntegerString(s: string): boolean {
  const num = Number(s);
  return !isNaN(num) && parseInt(s, 10) === num;
}

export function fileToBase64(file: File | Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    // convert file to base64
    if (file instanceof Buffer) {
      resolve(file.toString("base64"));
      return;
    }

    if (file instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result?.toString().split(",")[1];
        if (base64) {
          resolve(base64);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = (error) => reject(error);
      return;
    }

    reject(new Error("Invalid file type"));
  });
}

export function parseToBigInt(num: string): bigint {
  return BigInt(num);
}
