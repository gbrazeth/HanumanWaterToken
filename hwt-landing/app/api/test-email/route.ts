import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function GET() {
  try {
    console.log("=== TESTE DE EMAIL ===")
    const apiKey = process.env.RESEND_API_KEY
    console.log("API Key configurada:", apiKey ? "Sim" : "Não")
    console.log("API Key:", apiKey)

    if (!apiKey) {
      return NextResponse.json({ error: "API Key não encontrada" }, { status: 500 })
    }

    const resend = new Resend(apiKey)

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "gabrielbbraz@gmail.com",
      subject: "Teste de Email HWT",
      html: "Este é um email de teste do sistema HWT."
    })

    if (error) {
      console.error("Erro ao enviar email:", error)
      return NextResponse.json({ error: error }, { status: 500 })
    }

    console.log("Email enviado com sucesso:", data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Erro no teste:", error)
    return NextResponse.json(
      { error: `Erro no teste: ${error instanceof Error ? error.message : "Erro desconhecido"}` },
      { status: 500 }
    )
  }
}
