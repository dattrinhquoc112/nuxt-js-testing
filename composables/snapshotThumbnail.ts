import html2canvas from 'html2canvas';
import { useUploadStore } from '@/stores/upload';

export default function useSnapshotThumbnail() {
  const { uploadFile } = useUploadStore();

  async function captureElementToFile(
    element: HTMLElement,
    filename: string = 'capture.png',
    mimeType: string = 'image/png'
  ): Promise<File> {
    const canvas = await html2canvas(element);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], filename, { type: mimeType });
          resolve(file);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, mimeType);
    });
  }

  const handleGetThumbnailSnapshot = async (
    selector: string = '.section-snapshot #editor .section'
  ) => {
    const element = document.querySelector(selector);
    if (element && element instanceof HTMLElement) {
      const file = await captureElementToFile(element);
      const res = await uploadFile(file);
      return res;
    }
  };

  return { handleGetThumbnailSnapshot };
}
