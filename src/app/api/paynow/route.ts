import { NextResponse } from 'next/server'
import { Paynow } from 'paynow'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { bookId, price, email } = await request.json()

  // 1. Get the current User ID (if logged in)
  // This is crucial for adding the book to their library later
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id || null // If guest, this is null

  // 2. Insert the "Pending" Order into Database
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
        user_email: email,
        amount: price,
        status: 'pending', // Starts as pending
        user_id: userId,   // Links order to the user
        book_id: bookId    // Links order to the book
    })
    .select()
    .single()

  if (error) {
    console.error("Database Error:", error)
    return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
  }

  // 3. Setup Paynow
  const paynow = new Paynow(
    process.env.PAYNOW_INTEGRATION_ID!,
    process.env.PAYNOW_INTEGRATION_KEY!
  )

  // IMPORTANT: The Return URL now points to a handler that will "Unlock" the book
  paynow.resultUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/paynow/webhook`
  paynow.returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?orderId=${order.id}`

  const payment = paynow.createPayment(`Order #${order.id}`, email)
  payment.add('Book Purchase', price)

  try {
    const response = await paynow.send(payment)

    if (response.success) {
      // 4. Save the Paynow "Poll URL" to the order so we can check status later
      await supabase
        .from('orders')
        .update({ payment_provider_id: response.pollUrl })
        .eq('id', order.id)

      return NextResponse.json({ url: response.redirectUrl })
    } else {
      return NextResponse.json({ error: 'Paynow connection failed' }, { status: 500 })
    }
  } catch (err) {
    return NextResponse.json({ error: 'Connection error' }, { status: 500 })
  }
}