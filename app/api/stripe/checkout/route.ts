import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover",
  });
}

export async function POST() {
  try {
    const stripe = getStripe();
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Find user ID by email
    const { prisma } = await import("@/lib/prisma");
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Ad-Free Upgrade",
              description: "Remove all ads permanently",
            },
            unit_amount: 500, // $5.00
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
      },
      success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/practice?upgraded=true`,
      cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/practice`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
