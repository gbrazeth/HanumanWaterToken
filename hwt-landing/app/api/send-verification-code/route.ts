import { NextResponse } from "next/server"
import { Resend } from "resend"

// Armazenamento temporário para códigos de verificação
// Em produção, use um banco de dados ou Redis
const verificationCodes: Record<string, { code: string; expires: number }> = {}

export async function POST(request: Request) {
  try {
    // Verificar se a API key está definida
    console.log("=== VERIFICANDO API KEY ===")
    console.log("Todas as variáveis de ambiente:", process.env)
    const apiKey = process.env.RESEND_API_KEY
    console.log("API Key encontrada:", apiKey)

    if (!apiKey) {
      console.error("RESEND_API_KEY não está definida nas variáveis de ambiente")
      // Fallback para modo de desenvolvimento se a API key não estiver disponível
      return handleDevMode(request)
    }

    // Inicializar o cliente Resend com a API key
    const resend = new Resend(apiKey)

    // Extrair o email do corpo da requisição
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

    try {
      console.log("=== INÍCIO DO PROCESSO DE ENVIO ===")
      console.log("API Key configurada:", apiKey ? "Sim" : "Não")
      console.log("Tentando enviar email para:", email)

      // Enviar o email com o código usando seu domínio verificado
      // Substitua "noreply@seudominio.com" pelo seu endereço de email real
      const { data, error } = await resend.emails.send({
        from: "Hanuman Water Token <onboarding@resend.dev>",
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
        console.error("=== ERRO NO ENVIO DO EMAIL ===")
        console.error("Erro detalhado do Resend:", JSON.stringify(error))
        console.error("Dados da tentativa:", { from: "onboarding@resend.dev", to: email })
        // Fallback para modo de desenvolvimento se houver erro no envio
        return NextResponse.json({
          success: true,
          message: "Modo de fallback: Erro ao enviar email real, usando modo de desenvolvimento",
          devCode: verificationCode,
        })
      }

      console.log("Email enviado com sucesso:", data)
      return NextResponse.json({ success: true })
    } catch (emailError) {
      console.error("Erro ao enviar email:", emailError)

      // Fallback para modo de desenvolvimento se houver erro no envio
      return NextResponse.json({
        success: true,
        message: "Modo de fallback: Erro ao enviar email real, usando modo de desenvolvimento",
        devCode: verificationCode,
      })
    }
  } catch (error) {
    console.error("Erro no servidor:", error)
    return NextResponse.json(
      {
        error: `Erro interno do servidor: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
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

    console.log("Código gerado para", email, ":", verificationCode)

    // Modo de desenvolvimento - retorna sucesso com o código
    return NextResponse.json({
      success: true,
      message: "Modo de desenvolvimento: código gerado com sucesso",
      devCode: verificationCode,
    })
  } catch (error) {
    console.error("Erro no modo de desenvolvimento:", error)
    return NextResponse.json(
      {
        error: `Erro interno do servidor: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      },
      { status: 500 },
    )
  }
}

