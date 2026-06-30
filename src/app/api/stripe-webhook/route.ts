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
    const session = event.data.object as any
    const supabase = await createClient()

    const userId = session.metadata?.user_id
    const total = (session.amount_total || 0) / 100

    if (!userId) return NextResponse.json({ error: "No user_id" }, { status: 400 })

    const shipping = session.shipping || session.shipping_details
    const address = shipping?.address
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        status: "paid",
        total,
        stripe_session_id: session.id,
        shipping_address: address ? {
          line1: address.line1 || "",
          city: address.city || "",
          state: address.state || "",
          postal_code: address.postal_code || "",
          country: address.country || "",
        } : null,
      })
      .select()
      .single()

    if (orderError) {
      console.error("Order creation error:", orderError)
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    const productIds = (session.metadata?.product_ids || "").split(",")
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
    const orderItems = lineItems.data.map((item, idx) => ({
      order_id: order.id,
      product_id: productIds[idx] || "",
      variant: {},
      quantity: item.quantity || 1,
      price_at_purchase: (item.amount_total || 0) / 100 / (item.quantity || 1),
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)
    if (itemsError) console.error("Order items error:", itemsError)
  }

  return NextResponse.json({ received: true })
}
