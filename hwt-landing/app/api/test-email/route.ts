import { NextResponse } from "next/server"
import { Resend } from "resend"
import { logger } from "@/lib/logger"

/**
 * Email Test Endpoint
 * WARNING: This endpoint should be disabled in production
 * Only use for development/testing purposes
 */

export async function GET() {
  // Disable in production
  if (process.env.NODE_ENV === 'production') {
    logger.warn("Test email endpoint accessed in production")
    return NextResponse.json(
      { error: "This endpoint is disabled in production" },
      { status: 403 }
    )
  }

  try {
    const apiKey = process.env.RESEND_API_KEY
    const testEmail = process.env.TEST_EMAIL || "test@example.com"

    if (!apiKey) {
      logger.error("RESEND_API_KEY not configured")
      return NextResponse.json({ error: "API Key not configured" }, { status: 500 })
    }

    logger.info("Testing email configuration", { hasApiKey: !!apiKey })

    const resend = new Resend(apiKey)

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM || "Hanuman Water Token <onboarding@resend.dev>",
      to: testEmail,
      subject: "HWT Email Test",
      html: "<p>This is a test email from the HWT system.</p>"
    })

    if (error) {
      logger.error("Failed to send test email", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    logger.info("Test email sent successfully")
    return NextResponse.json({ success: true, message: "Test email sent" })
  } catch (error) {
    logger.error("Error in test email endpoint", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
