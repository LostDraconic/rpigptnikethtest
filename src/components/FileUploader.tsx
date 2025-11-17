import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface FileUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
}

export const FileUploader = ({ onUpload }: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [fileOptions, setFileOptions] = useState<Record<string, { type: string; required: boolean }>>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles];
    setFiles(newFiles);
    
    // Set default options for new files
    const newOptions = { ...fileOptions };
    acceptedFiles.forEach((file) => {
      if (!newOptions[file.name]) {
        newOptions[file.name] = { type: 'lecture', required: false };
      }
    });
    setFileOptions(newOptions);
  }, [files, fileOptions]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = (index: number) => {
    const fileName = files[index].name;
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileOptions((prev) => {
      const updated = { ...prev };
      delete updated[fileName];
      return updated;
    });
  };

  const previewFileContent = (file: File) => {
    setPreviewFile(file);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);

    try {
      await onUpload(files);
      setFiles([]);
      setFileOptions({});
      setProgress(100);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed p-12 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        {isDragActive ? (
          <p className="text-lg">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-lg mb-2">Drag & drop files here, or click to select</p>
            <p className="text-sm text-muted-foreground">
              Upload lecture notes, assignments, syllabi, or other course materials
            </p>
          </div>
        )}
      </Card>

      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((file, index) => (
            <Card key={index} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => previewFileContent(file)}
                    disabled={uploading}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">File Type</Label>
                  <Select
                    value={fileOptions[file.name]?.type || 'lecture'}
                    onValueChange={(value) =>
                      setFileOptions((prev) => ({
                        ...prev,
                        [file.name]: { ...prev[file.name], type: value },
                      }))
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lecture">Lecture Notes</SelectItem>
                      <SelectItem value="textbook">Textbook</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="exam">Exam/Midterm</SelectItem>
                      <SelectItem value="syllabus">Syllabus</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-xs">Mark as Required</Label>
                  <Select
                    value={fileOptions[file.name]?.required ? 'yes' : 'no'}
                    onValueChange={(value) =>
                      setFileOptions((prev) => ({
                        ...prev,
                        [file.name]: { ...prev[file.name], required: value === 'yes' },
                      }))
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">Optional</SelectItem>
                      <SelectItem value="yes">Required Reading</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          ))}

          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-center text-muted-foreground">
                Uploading... {Math.round(progress)}%
              </p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            className="w-full transition-all hover:scale-105"
            size="lg"
          >
            Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
          </Button>
        </div>
      )}

      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>File Preview: {previewFile?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                File Type: {previewFile?.type || 'Unknown'}
              </p>
              <p className="text-sm text-muted-foreground">
                Size: {previewFile ? formatFileSize(previewFile.size) : '0 Bytes'}
              </p>
            </div>
            {previewFile?.type.startsWith('text/') ? (
              <div className="p-4 bg-muted rounded-lg max-h-96 overflow-auto">
                <pre className="text-xs whitespace-pre-wrap">
                  <p className="text-muted-foreground">Text file preview</p>
                </pre>
              </div>
            ) : previewFile?.type.startsWith('image/') ? (
              <div className="flex justify-center">
                <img
                  src={URL.createObjectURL(previewFile)}
                  alt="Preview"
                  className="max-w-full max-h-96 object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-2" />
                <p>Preview not available for this file type</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
