// src/lib/exportUtils.ts
import html2canvas from 'html2canvas';

export const exportMindMapAsImage = async (canvasElement: HTMLCanvasElement | null, fileName: string = 'mindmap.png') => {
  if (!canvasElement) {
    console.error("Canvas element not found for export.");
    alert("Error: Canvas element not found.");
    return;
  }

  try {
    // Ensure the R3F canvas has preserveDrawingBuffer: true
    const canvas = await html2canvas(canvasElement, {
        useCORS: true, // If you load external images/fonts, though not in this setup
        allowTaint: true,
        backgroundColor: null, // Use transparent background from canvas
    });
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error exporting image:", error);
    alert("Failed to export image. See console for details.");
  }
};