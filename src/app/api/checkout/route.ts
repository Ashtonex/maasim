import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
const { Paynow } = require("paynow")

export async function POST(request: Request) {
  try {
    const { bookId, email } = await request.json()
    const supabase = await createClient()

    // 1. Fetch Book Details
    const { data: book } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single()

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    // 2. Initialize Paynow
    const paynow = new Paynow(
      process.env.PAYNOW_INTEGRATION_ID,
      process.env.PAYNOW_INTEGRATION_KEY
    )

    // Set Result and Return URLs
    paynow.resultUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment-update` // Webhook (Background)
    paynow.returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/success` // Where user goes after paying

    // 3. Create Payment
    // Reference: "BookID_Timestamp" so it is unique
    const invoiceId = `Velcro_${book.id}_${Date.now()}`
    const payment = paynow.createPayment(invoiceId, email)

    // Add Item (Title, Price)
    payment.add(book.title, book.price)

    // 4. Send to Paynow
    const response = await paynow.send(payment)

    if (response.success) {
      // IMPORTANT: We should save the "pollUrl" to the database later to check status
      // For now, we just send the user to the payment link
      return NextResponse.json({ url: response.redirectUrl, pollUrl: response.pollUrl })
    } else {
      console.error("Paynow Error:", response.error)
      return NextResponse.json({ error: 'Paynow connection failed' }, { status: 500 })
    }

  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}