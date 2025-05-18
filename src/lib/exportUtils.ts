// src/lib/exportUtils.ts
import html2canvas from 'html2canvas';

export const exportMindMapAsImage = async (
  elementToCapture: HTMLElement | null,
  fileName: string = 'mindmap.png'
) => {
  if (!elementToCapture) {
    console.error("Element to capture not found for export.");
    alert("Error: Element to capture not found for export.");
    return;
  }

  // Add a small delay to allow the browser to paint everything
  await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay, adjust if needed

  try {
    console.log("Attempting to capture element for export:", elementToCapture);
    const canvas = await html2canvas(elementToCapture, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null, // Keep this, it's important for transparency attempts
      // Ensure html2canvas captures the full scroll width/height if content overflows
      width: elementToCapture.scrollWidth,
      height: elementToCapture.scrollHeight,
      // Optional: Try a higher scale for better resolution, can also affect rendering
      // scale: window.devicePixelRatio || 2,
      logging: true, // Enable html2canvas logging for more clues in the console
    });
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("Image export should be complete.");
  } catch (error) {
    console.error("Error exporting image with html2canvas:", error);
    alert("Failed to export image. See console for details.");
  }
};