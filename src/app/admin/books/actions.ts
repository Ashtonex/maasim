'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addBook(formData: FormData) {
  const supabase = await createClient()

  // 1. Get Form Data
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = formData.get('price') as string
  const coverFile = formData.get('cover') as File
  const bookFile = formData.get('book_file') as File

  // 2. Validate basics
  if (!coverFile || !bookFile) {
    throw new Error('Both cover image and book file are required.')
  }

  // 3. Upload Cover Image (Public Bucket)
  const coverPath = `${Date.now()}-${coverFile.name}`
  const { error: coverError } = await supabase.storage
    .from('book-covers')
    .upload(coverPath, coverFile)

  if (coverError) throw new Error(`Cover upload failed: ${coverError.message}`)

  // Get the Public URL for the cover (everyone can see this)
  const { data: { publicUrl: coverUrl } } = supabase.storage
    .from('book-covers')
    .getPublicUrl(coverPath)

  // 4. Upload Book File (Private Bucket)
  const filePath = `${Date.now()}-${bookFile.name}`
  const { error: fileError } = await supabase.storage
    .from('book-files')
    .upload(filePath, bookFile)

  if (fileError) throw new Error(`Book file upload failed: ${fileError.message}`)

  // 5. Insert into Database
  const { error: dbError } = await supabase
    .from('books')
    .insert({
      title,
      description,
      price: parseFloat(price),
      cover_url: coverUrl,
      file_url: filePath, // Store the internal path, not a public URL!
      is_published: true, // Auto-publish for now
    })

  if (dbError) throw new Error(`Database error: ${dbError.message}`)

  // 6. Finish
  revalidatePath('/admin') // Refresh the dashboard data
  redirect('/admin') // Send user back to dashboard
}