import { NextResponse } from "next/server"
import { Resend } from "resend"
import { logger } from "@/lib/logger"
import { isValidEmail, checkRateLimit } from "@/lib/validators"

/**
 * Temporary storage for verification codes
 * TODO: Replace with Redis or database in production
 */
const verificationCodes: Record<string, { code: string; expires: number }> = {}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      logger.warn("RESEND_API_KEY not configured, using development mode")
      return handleDevMode(request)
    }

    logger.debug("Email API initialized", { hasApiKey: !!apiKey })

    // Inicializar o cliente Resend com a API key
    const resend = new Resend(apiKey)

    // Extract and validate email from request body
    const { email } = await request.json()

    // Validate email format
    if (!isValidEmail(email)) {
      logger.warn("Invalid email format attempted", { email: email?.slice(0, 3) + '***' })
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Rate limiting: max 5 requests per email per minute
    const rateLimit = checkRateLimit(`email:${email}`, 5, 60000)
    if (!rateLimit.allowed) {
      logger.warn("Rate limit exceeded for email verification", { 
        email: email.slice(0, 3) + '***',
        resetTime: new Date(rateLimit.resetTime).toISOString()
      })
      return NextResponse.json(
        { 
          error: "Too many requests. Please try again later.",
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000))
          }
        }
      )
    }

    // Gerar um código de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Armazenar o código com expiração de 10 minutos
    verificationCodes[email] = {
      code: verificationCode,
      expires: Date.now() + 10 * 60 * 1000,
    }

    try {
      logger.info("Sending verification email", { 
        email: email.replace(/(.{3}).*(@.*)/, '$1***$2') // Mask email
      })

      // Enviar o email com o código usando seu domínio verificado
      // Substitua "noreply@seudominio.com" pelo seu endereço de email real
      const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM || "Hanuman Water Token <onboarding@resend.dev>",
        to: email,
        subject: "Seu código de verificação HWT",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Verificação HWT</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 20px; background-color: #8B0000; text-align: center;">
                  <h1 style="color: white; margin: 0;">HWT</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px;">
                  <h2 style="color: #8B0000; margin-top: 0;">Verificação de Conta</h2>
                  <p>Olá,</p>
                  <p>Recebemos uma solicitação para acessar sua conta HWT. Use o código abaixo para verificar sua identidade:</p>
                  <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 4px;">
                    ${verificationCode}
                  </div>
                  <p>Este código expira em 10 minutos.</p>
                  <p>Se você não solicitou este código, por favor ignore este email ou entre em contato com nosso suporte.</p>
                  <p>Atenciosamente,<br>Equipe HWT</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; background-color: #f4f4f4; text-align: center; font-size: 12px; color: #666;">
                  <p>&copy; ${new Date().getFullYear()} Hanuman Water Token. Todos os direitos reservados.</p>
                  <p>Este é um email automático, por favor não responda.</p>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      })

      if (error) {
        logger.error("Failed to send email via Resend", error)
        // Fallback to development mode on email error
        return NextResponse.json({
          success: true,
          message: "Fallback mode: Using development verification",
          devCode: process.env.NODE_ENV === 'development' ? verificationCode : undefined,
        })
      }

      logger.info("Verification email sent successfully")
      return NextResponse.json({ success: true })
    } catch (emailError) {
      logger.error("Email sending error", emailError)

      // Fallback para modo de desenvolvimento se houver erro no envio
      return NextResponse.json({
        success: true,
        message: "Modo de fallback: Erro ao enviar email real, usando modo de desenvolvimento",
        devCode: verificationCode,
      })
    }
  } catch (error) {
    logger.error("Server error in verification code endpoint", error)
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

// Função para lidar com o modo de desenvolvimento
async function handleDevMode(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    // Gerar um código de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Armazenar o código com expiração de 10 minutos
    verificationCodes[email] = {
      code: verificationCode,
      expires: Date.now() + 10 * 60 * 1000,
    }

    logger.debug("Development mode: verification code generated", { email })

    // Development mode - return code for testing
    return NextResponse.json({
      success: true,
      message: "Development mode: verification code generated",
      devCode: verificationCode,
    })
  } catch (error) {
    logger.error("Error in development mode", error)
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

