/**
 * Client-side file upload utility that sends files to Express server /api/upload endpoint
 * and returns the relative path (e.g., /uploads/file-12345.jpg) stored permanently on server.
 */
export async function uploadFileToServer(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Upload failed with status ${response.status}`);
  }

  const data = await response.json();
  if (data.success && data.url) {
    return data.url;
  }
  throw new Error(data.error || 'Upload failed: invalid response from server');
}
