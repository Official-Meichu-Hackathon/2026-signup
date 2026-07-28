import { useRef, useState } from 'react'
import QuestionTitle from './QuestionTitle'

interface FileUploadProps {
  title: string
  description?: string
  accept?: string[]
  maxSize?: number
  value: File | null
  onChange: (file: File | null) => void
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

const readAsBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).replace(/^.*,/, ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

export default function FileUpload({
  title,
  description,
  accept = ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'gif'],
  maxSize = 10 * 1024 * 1024,
  value,
  onChange,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploaded, setUploaded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `檔案 ${file.name} 大小超過限制 (${formatFileSize(maxSize)})`
    }
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!accept.includes(ext)) {
      return `不支援的檔案格式。支援格式：${accept.join(', ')}`
    }
    return null
  }

  const uploadFile = async (file: File) => {
    const url = import.meta.env.VITE_FILE_UPLOAD_URL
    if (!url) {
      setError('檔案上傳連結未設置')
      return
    }

    setIsUploading(true)
    setError(null)
    try {
      const base64 = await readAsBase64(file)
      const formData = new FormData()
      formData.append('file', base64)
      formData.append('filename', file.name)
      formData.append('mimeType', file.type)

      const response = await fetch(url, { method: 'POST', body: formData })
      if (!response.ok) {
        setError('檔案上傳失敗，請重試')
        return
      }
      const result = (await response.json()) as { ok: boolean; error?: string }
      if (!result.ok) {
        setError(result.error || '檔案上傳失敗，請重試')
        return
      }
      setUploaded(true)
    } catch {
      setError('檔案上傳失敗，請重試')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFile = async (file: File | undefined) => {
    setError(null)
    setUploaded(false)
    if (!file) return

    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    onChange(file)
    await uploadFile(file)
  }

  const removeFile = () => {
    onChange(null)
    setError(null)
    setUploaded(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="py-2 md:py-6">
      <h3 className="text-[0.6875rem] text-white md:text-lg">
        <QuestionTitle title={title} />
      </h3>
      {description && (
        <p className="mx-4 mt-1.5 text-[0.5625rem] whitespace-pre-line text-white/80 md:mt-2 md:text-base md:leading-normal">
          {description}
        </p>
      )}

      {error && (
        <div className="mx-4 mt-3 rounded-lg border border-red-400/40 bg-red-500/10 p-3">
          <p className="text-[0.5625rem] text-red-300 md:text-sm">{error}</p>
        </div>
      )}
      {uploaded && (
        <div className="mx-4 mt-3 rounded-lg border border-green-400/40 bg-green-500/10 p-3">
          <p className="text-[0.5625rem] text-green-300 md:text-sm">
            檔案上傳成功！
          </p>
        </div>
      )}

      <div
        className={`mx-4 mt-2 rounded-2xl border-2 bg-[#F6F6F6] p-4 text-center transition-colors md:mt-3 md:p-6 ${
          isUploading
            ? 'cursor-not-allowed border-[#B1A2CA]'
            : isDragging
              ? 'border-darkblue cursor-pointer'
              : 'cursor-pointer border-[#B1A2CA]'
        }`}
        onClick={() => !isUploading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          if (!isUploading) setIsDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setIsDragging(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          if (!isUploading) void handleFile(e.dataTransfer.files[0])
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept.map((ext) => `.${ext}`).join(', ')}
          onChange={(e) => void handleFile(e.target.files?.[0])}
          disabled={isUploading}
          className="hidden"
        />
        {isUploading ? (
          <>
            <span className="border-darkblue mx-auto mb-3 block h-8 w-8 animate-spin rounded-full border-b-2 md:mb-4 md:h-12 md:w-12" />
            <p className="text-darkblue text-[0.6875rem] md:text-lg">
              上傳中...
            </p>
          </>
        ) : value ? (
          <p className="text-darkblue text-[0.6875rem] md:text-lg">
            檔案已選擇，點擊此區域可以重新選擇檔案
          </p>
        ) : (
          <>
            <svg
              className="text-darkblue mx-auto mb-2 h-6 w-6 md:mb-3 md:h-8 md:w-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-darkblue text-[0.6875rem] font-bold md:text-lg">
              拖移檔案到這裡 或 點擊選擇檔案
            </p>
            <p className="mt-1.5 text-[0.5625rem] font-normal text-[#8f9cc4] md:mt-2 md:text-base md:leading-normal">
              支援格式：{accept.join(', ')}
              <br />
              檔案大小限制：{formatFileSize(maxSize)}
            </p>
          </>
        )}
      </div>

      {value && (
        <div className="mx-4 mt-2.5 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-2.5 md:mt-4 md:p-3">
          <div>
            <p className="text-[0.625rem] font-medium text-white md:text-base">
              {value.name}
            </p>
            <p className="text-[0.5625rem] font-normal text-white/50 md:text-sm">
              {formatFileSize(value.size)}
              {uploaded && <span className="text-green-300"> ✓ 上傳完成</span>}
            </p>
          </div>
          <button
            type="button"
            onClick={removeFile}
            disabled={isUploading}
            className="cursor-pointer text-[0.625rem] text-red-300 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50 md:text-base"
          >
            移除
          </button>
        </div>
      )}
    </div>
  )
}
