import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
const { Paynow } = require("paynow")

export async function POST(req: Request) {
  try {
    // 1. Parse the incoming data from Paynow
    // Paynow sends data as URL-encoded form data, not JSON
    const formData = await req.formData()
    const pollUrl = formData.get('pollurl') as string
    const status = formData.get('status')
    const paynowRef = formData.get('paynowreference')

    // 2. Security Check: Verify with Paynow
    // We don't trust the incoming data blindly. We ask Paynow "Is this true?"
    const paynow = new Paynow(
      process.env.PAYNOW_INTEGRATION_ID,
      process.env.PAYNOW_INTEGRATION_KEY
    )

    // Poll the URL to get the REAL status
    const pollResult = await paynow.pollTransaction(pollUrl)

    if (pollResult.status === 'Paid' || pollResult.status === 'Awaiting Delivery') {
      
      const supabase = await createClient()
      
      // The "reference" we sent earlier looks like: Velcro_BOOKID_TIMESTAMP
      // We need to parse it to get the Book ID
      const localRef = pollResult.reference // e.g., "Velcro_abc123_99999"
      const parts = localRef.split('_')
      const bookId = parts[1] // The ID is in the middle

      // 3. Record the Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_email: pollResult.email,
          amount: pollResult.amount,
          status: 'paid',
          paynow_ref: paynowRef,
          book_id: bookId,
          // We assume guest for now, unless we passed user_id in metadata (Paynow metadata is tricky, simpler to match by email later)
        })
        .select()
        .single()

      if (orderError) console.error('Order Insert Error:', orderError)

      // 4. Fulfillment Logic
      // Check if this email belongs to a registered user
      const { data: user } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', pollResult.email)
        .single()

      if (user) {
        // SCENARIO A: Registered User -> Add to Library
        await supabase
          .from('library')
          .insert({
            user_id: user.id,
            book_id: bookId
          })
        console.log(`Access granted to User ${user.id}`)
      } else {
        // SCENARIO B: Guest User -> We have the Order recorded.
        // In a real app, here we would trigger an email using Resend/SendGrid 
        // with the file link. For now, we log it.
        console.log(`Guest Order recorded for ${pollResult.email}. Send email here.`)
      }

      return NextResponse.json({ message: 'Payment Processed' }, { status: 200 })
    }

    return NextResponse.json({ message: 'Status not paid' }, { status: 200 })

  } catch (err: any) {
    console.error('Webhook Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}