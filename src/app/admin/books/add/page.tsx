'use client'

import { addBook } from '../actions'
import { useState } from 'react'
import { Upload, FileText, DollarSign, BookOpen } from 'lucide-react'

export default function AddBookPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // We wrap the Server Action to handle loading states
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)

    try {
      await addBook(formData)
      // If successful, the action will redirect us.
    } catch (e: any) {
      console.error(e)
      setError(e.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Add New Book</h2>
        <p className="text-gray-500">Upload a new PDF/Epub to the library.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
          <div className="relative">
            <BookOpen className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              name="title"
              type="text"
              required
              placeholder="e.g. The Adventures of Maasim"
              className="pl-10 block w-full rounded-lg border border-gray-300 py-2.5 px-3 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            rows={4}
            required
            placeholder="What is this book about?"
            className="block w-full rounded-lg border border-gray-300 py-2.5 px-3 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              name="price"
              type="number"
              step="0.01"
              required
              placeholder="9.99"
              className="pl-10 block w-full rounded-lg border border-gray-300 py-2.5 px-3 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cover Image Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-yellow-400 transition bg-gray-50">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <label className="block text-sm font-medium text-gray-900 cursor-pointer">
              <span>Upload Cover</span>
              <input name="cover" type="file" accept="image/*" required className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100" />
            </label>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
          </div>

          {/* Book File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition bg-gray-50">
            <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <label className="block text-sm font-medium text-gray-900 cursor-pointer">
              <span>Upload PDF/EPUB</span>
              <input name="book_file" type="file" accept=".pdf,.epub" required className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </label>
            <p className="text-xs text-gray-500 mt-1">The actual product file</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
        >
          {loading ? 'Uploading & Saving...' : 'Create Book'}
        </button>
      </form>
    </div>
  )
}