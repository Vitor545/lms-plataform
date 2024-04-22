'use client';
import { NextPage } from 'next'
import { UploadDropzone } from '@/lib/uploadthing';
import { ourFileRouter } from '@/app/api/uploadthing/core';
import { error } from 'console';
import toast from 'react-hot-toast';

interface Props {
    onChange: (url?: string) => void
    endpoint: keyof typeof ourFileRouter
}

const FileUpload: NextPage<Props> = ({endpoint, onChange}) => {
  return <UploadDropzone 
  endpoint={endpoint} 
  onClientUploadComplete={(res) => onChange(res?.[0]?.url)}
  onUploadError={(error: Error) => toast.error(error?.message)}
  />
}

export default FileUpload