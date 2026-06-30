import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature") || ""

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const supabase = await createClient()

    const userId = session.metadata?.user_id
    const customerEmail = session.customer_email
    const total = (session.amount_total || 0) / 100

    if (!userId) return NextResponse.json({ error: "No user_id" }, { status: 400 })

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        status: "paid",
        total,
        stripe_session_id: session.id,
        shipping_address: {
          line1: session.shipping_details?.address?.line1 || "",
          city: session.shipping_details?.address?.city || "",
          state: session.shipping_details?.address?.state || "",
          postal_code: session.shipping_details?.address?.postal_code || "",
          country: session.shipping_details?.address?.country || "",
        },
      })
      .select()
      .single()

    if (orderError) {
      console.error("Order creation error:", orderError)
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
    const orderItems = lineItems.data.map((item) => ({
      order_id: order.id,
      product_id: item.price?.product as string,
      variant: {},
      quantity: item.quantity || 1,
      price_at_purchase: (item.amount_total || 0) / 100 / (item.quantity || 1),
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)
    if (itemsError) console.error("Order items error:", itemsError)
  }

  return NextResponse.json({ received: true })
}
