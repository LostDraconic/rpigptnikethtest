const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  courseId: string;
}

export const uploadFiles = async (
  courseId: string,
  files: File[],
  onProgress?: (progress: number) => void
): Promise<UploadedFile[]> => {
  const uploadedFiles: UploadedFile[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await delay(100);
      if (onProgress) {
        onProgress((progress + (i * 100)) / files.length);
      }
    }

    uploadedFiles.push({
      id: `file-${Date.now()}-${i}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      courseId,
    });
  }

  return uploadedFiles;
};

export const getUploadedFiles = async (courseId: string): Promise<UploadedFile[]> => {
  await delay(400);
  
  // Mock uploaded files
  return [
    {
      id: 'file-1',
      name: 'Lecture_Notes_Week1.pdf',
      size: 2048576,
      type: 'application/pdf',
      uploadedAt: new Date('2025-11-01'),
      courseId,
    },
    {
      id: 'file-2',
      name: 'Assignment_Guidelines.docx',
      size: 524288,
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      uploadedAt: new Date('2025-11-05'),
      courseId,
    },
  ];
};

export const uploadTeachingMaterial = async (
  courseId: string,
  files: File[],
  metadata: { required?: boolean; visible?: boolean }
): Promise<UploadedFile[]> => {
  // Similar to uploadFiles but with additional metadata
  return uploadFiles(courseId, files);
};

export const getTeachingMaterials = async (
  courseId: string
): Promise<UploadedFile[]> => {
  return getUploadedFiles(courseId);
};
