"use client"
import { useRef } from 'react';
import { UploadCloudIcon } from 'lucide-react'
import { useFileStore } from '@/app/stores/fileStore';

const UploadFiles = () => {
const setFile = useFileStore((state) => state.setFile)
const inputFileRef = useRef<HTMLInputElement>(null);

const handleInputChange = () => {
    const files = inputFileRef.current?.files
    if (files) {
        setFile(files[0])
    }
}

    return (
        <div>
            <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-15 p-3 border-1 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition duration-300 ease-in-out"
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloudIcon color='blue' size='25px' className='mt-2' />
                    <p className="mb-2 text-sm text-blue-600">
                        <span className="font-semibold">Upload an image</span>
                    </p>
                </div>
                
                <input
                    onChange={handleInputChange}
                    ref={inputFileRef}
                    id="file-upload"
                    type="file"
                    className="hidden"
                    multiple
                />
            </label>
        </div>
  )
}

export default UploadFiles
