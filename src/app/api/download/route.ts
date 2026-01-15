import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const bookId = searchParams.get('bookId')

  if (!bookId) {
    return NextResponse.json({ error: 'Book ID required' }, { status: 400 })
  }

  const supabase = await createClient()

  // 1. Get Current User
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    // If we want to support Guest downloads later, we would check a "token" here.
    // For now, strict login check.
    return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 })
  }

  // 2. Security Check: Does this user own this book?
  const { data: libraryEntry } = await supabase
    .from('library')
    .select('id')
    .eq('user_id', user.id)
    .eq('book_id', bookId)
    .single()

  if (!libraryEntry) {
    return NextResponse.json({ error: 'You do not own this book.' }, { status: 403 })
  }

  // 3. Get the File Path from the Book
  const { data: book } = await supabase
    .from('books')
    .select('file_path')
    .eq('id', bookId)
    .single()

  if (!book || !book.file_path) {
    return NextResponse.json({ error: 'File not found.' }, { status: 404 })
  }

  // 4. Generate the Signed URL (Valid for 60 seconds)
  // Assumes your bucket is named 'book_files' (Change this if your bucket is different)
  const { data: signedData, error: signError } = await supabase
    .storage
    .from('book_files') 
    .createSignedUrl(book.file_path, 60) // 60 seconds expiry

  if (signError) {
    console.error('Storage Error:', signError)
    return NextResponse.json({ error: 'Could not generate download link.' }, { status: 500 })
  }

  // 5. Success! Redirect the browser to the temporary file link
  return NextResponse.redirect(signedData.signedUrl)
}