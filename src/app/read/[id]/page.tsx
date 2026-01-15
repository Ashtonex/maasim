import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Reader from './Reader' // Import the client component we just made

export const dynamic = 'force-dynamic'

export default async function ReadPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // 1. Auth Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Fetch Book Details
  // We need to await params in Next.js 14/15 if it's dynamic
  const bookId = params.id 
  
  const { data: book, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', bookId)
    .single()

  if (error || !book) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFFDF5]">
            <div className="text-center">
                <h1 className="text-4xl font-black mb-4">Book Not Found</h1>
                <a href="/library" className="underline font-bold">Return to Library</a>
            </div>
        </div>
    )
  }

  // 3. Render the Client Reader
  return <Reader book={book} />
}