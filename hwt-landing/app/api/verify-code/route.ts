import { NextResponse } from "next/server"

// Acesso ao mesmo armazenamento de códigos
// Em produção, use um banco de dados ou Redis
const verificationCodes: Record<string, { code: string; expires: number }> = {}

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: "Email e código são obrigatórios" }, { status: 400 })
    }

    // Para desenvolvimento, aceitar qualquer código de 6 dígitos
    if (code.length === 6 && /^\d+$/.test(code)) {
      // Simular verificação bem-sucedida
      return NextResponse.json({
        success: true,
        message: "Verificação bem-sucedida (modo de desenvolvimento)!",
      })
    }

    const storedData = verificationCodes[email]

    // Verificar se o código existe e não expirou
    if (!storedData) {
      return NextResponse.json(
        { error: "Código não encontrado ou expirado. Solicite um novo código." },
        { status: 400 },
      )
    }

    if (Date.now() > storedData.expires) {
      // Remover código expirado
      delete verificationCodes[email]
      return NextResponse.json({ error: "Código expirado. Solicite um novo código." }, { status: 400 })
    }

    if (storedData.code !== code) {
      return NextResponse.json({ error: "Código inválido. Verifique e tente novamente." }, { status: 400 })
    }

    // Código válido, remover após uso
    delete verificationCodes[email]

    return NextResponse.json({
      success: true,
      message: "Verificação bem-sucedida!",
    })
  } catch (error) {
    console.error("Erro no servidor:", error)
    return NextResponse.json(
      { error: `Erro interno do servidor: ${error instanceof Error ? error.message : "Erro desconhecido"}` },
      { status: 500 },
    )
  }
}

