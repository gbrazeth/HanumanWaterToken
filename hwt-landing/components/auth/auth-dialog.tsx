"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle } from "lucide-react"

// ID do cliente do Google fornecida pelo usuário
const GOOGLE_CLIENT_ID = "239245569493-n3dsetphvpail5u2g0mgngefcsddsds8.apps.googleusercontent.com"

export function AuthDialog({
  open,
  onOpenChange,
  onLoginSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoginSuccess?: () => void
}) {
  const [email, setEmail] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [codeError, setCodeError] = useState<string | null>(null)
  const [googleError, setGoogleError] = useState<string | null>(null)
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false)
  const [devCode, setDevCode] = useState<string | null>(null)

  // Carregar o script do Google
  useEffect(() => {
    // Verificar se o script já está carregado
    if (document.getElementById("google-signin-script")) {
      setGoogleScriptLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.id = "google-signin-script"
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.onload = () => {
      console.log("Script do Google carregado")
      setGoogleScriptLoaded(true)
    }
    script.onerror = (error) => {
      console.error("Erro ao carregar script do Google:", error)
      setGoogleError("Não foi possível carregar a API do Google")
    }

    document.body.appendChild(script)

    return () => {
      // Não remover o script ao desmontar para evitar recarregamentos desnecessários
    }
  }, [])

  const handleGoogleLogin = () => {
    setGoogleError(null)

    if (!googleScriptLoaded || !window.google) {
      setGoogleError("API do Google não está disponível. Tente novamente mais tarde.")
      return
    }

    try {
      // Define a redirect URI - this should match what you've configured in Google Cloud Console
      // For local development, you can use the current origin
      const redirectUri = encodeURIComponent(window.location.origin)

      // Create a popup for Google login with the redirect_uri parameter
      const popup = window.open(
        `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&response_type=token&redirect_uri=${redirectUri}&scope=email%20profile&prompt=select_account&display=popup`,
        "GoogleLogin",
        "width=500,height=600",
      )

      if (!popup) {
        setGoogleError("Popup bloqueado pelo navegador. Por favor, permita popups para este site.")
        return
      }

      // Check periodically if the popup was closed or redirected
      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup)
          return
        }

        try {
          // Try to access the popup URL
          if (popup.location.href.includes("access_token")) {
            // Extract the access token from the URL
            const params = new URLSearchParams(popup.location.hash.substring(1))
            const accessToken = params.get("access_token")

            if (accessToken) {
              console.log("Token de acesso do Google recebido:", accessToken)

              // Close the popup
              popup.close()
              clearInterval(checkPopup)

              // Fetch user info with the access token
              fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log("Informações do usuário:", data)
                  // Simulate successful login
                  onOpenChange(false)
                  if (onLoginSuccess) {
                    onLoginSuccess()
                  }

                  // Salvar token de autenticação do Google
                  localStorage.setItem(
                    "hwt-auth-token",
                    JSON.stringify({
                      email: data.email,
                      timestamp: Date.now(),
                      method: "google",
                    }),
                  )
                })
                .catch((error) => {
                  console.error("Erro ao obter informações do usuário:", error)
                  setGoogleError("Erro ao obter informações do usuário")
                })
            }
          }
        } catch (e) {
          // Ignore cross-origin access errors
          // This happens when the popup is on a different domain
        }
      }, 500)

      // Clear the interval after 5 minutes to prevent memory leaks
      setTimeout(
        () => {
          clearInterval(checkPopup)
          if (!popup.closed) {
            popup.close()
          }
        },
        5 * 60 * 1000,
      )
    } catch (error) {
      console.error("Erro ao abrir popup do Google:", error)
      setGoogleError(`Erro ao iniciar login: ${error}`)
    }
  }

  const handleSendCode = async () => {
    if (!email || !email.includes("@")) {
      setEmailError("Por favor, insira um email válido")
      return
    }

    setEmailError(null)
    setDevCode(null)
    setLoading(true)

    try {
      const response = await fetch("/api/send-verification-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar código")
      }

      setCodeSent(true)
      console.log("Código enviado com sucesso!")

      // Se estamos em modo de desenvolvimento, mostrar o código
      if (data.devCode) {
        setDevCode(data.devCode)
        console.log("Código de desenvolvimento:", data.devCode)
      }
    } catch (error) {
      console.error("Erro:", error)
      setEmailError(error instanceof Error ? error.message : "Erro ao enviar código")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setCodeError("Por favor, insira o código de verificação")
      return
    }

    setCodeError(null)
    setLoading(true)

    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: verificationCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Código inválido")
      }

      // Login bem-sucedido
      onOpenChange(false)
      setLoading(false)
      setCodeSent(false)
      setEmail("")
      setVerificationCode("")
      setDevCode(null)

      if (onLoginSuccess) {
        onLoginSuccess()
      }

      // Salvar token de autenticação (simulado para este exemplo)
      localStorage.setItem(
        "hwt-auth-token",
        JSON.stringify({
          email,
          timestamp: Date.now(),
          method: "email",
        }),
      )
    } catch (error) {
      console.error("Erro:", error)
      setCodeError(error instanceof Error ? error.message : "Erro ao verificar código")
      setLoading(false)
    }
  }

  const connectMetamask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        onOpenChange(false)
        if (onLoginSuccess) {
          onLoginSuccess()
        }

        // Salvar informação da carteira conectada
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        localStorage.setItem(
          "hwt-auth-token",
          JSON.stringify({
            wallet: accounts[0],
            timestamp: Date.now(),
            method: "metamask",
          }),
        )
      } catch (error) {
        console.error("Erro ao conectar com Metamask:", error)
      }
    } else {
      window.alert("Por favor, instale a extensão Metamask para conectar sua carteira.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">Conectar-se</DialogTitle>
          <DialogDescription>Escolha uma das opções abaixo para acessar sua conta.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="google">Google</TabsTrigger>
            <TabsTrigger value="wallet">Carteira</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4 mt-4">
            {!codeSent ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                </div>
                <Button className="w-full bg-primary" onClick={handleSendCode} disabled={!email || loading}>
                  {loading ? "Enviando..." : "Enviar código de acesso"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md bg-muted p-3">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-muted-foreground">Um código de verificação foi enviado para {email}</p>
                      {devCode && (
                        <p className="text-sm font-medium mt-1 text-primary">
                          Modo de desenvolvimento: Use o código {devCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="code" className="text-sm font-medium">
                    Código de verificação
                  </label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Digite o código recebido"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  {codeError && <p className="text-sm text-red-500">{codeError}</p>}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setCodeSent(false)}>
                    Voltar
                  </Button>
                  <Button
                    className="flex-1 bg-primary"
                    onClick={handleVerifyCode}
                    disabled={!verificationCode || loading}
                  >
                    {loading ? "Verificando..." : "Verificar"}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="google" className="space-y-4 mt-4">
            <div className="flex flex-col items-center justify-center">
              <Button
                className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                onClick={handleGoogleLogin}
                disabled={!googleScriptLoaded}
              >
                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                Entrar com Google
              </Button>

              {googleError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  <p className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {googleError}
                  </p>
                </div>
              )}

              <p className="text-sm text-muted-foreground mt-4 text-center">
                Clique no botão acima para fazer login com sua conta Google
              </p>
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-4 mt-4">
            <Button className="w-full" variant="outline" onClick={connectMetamask}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M32.9582 1L19.8241 10.7183L22.2665 5.09986L32.9582 1Z"
                  fill="#E17726"
                  stroke="#E17726"
                  strokeWidth="0.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.04858 1L15.0707 10.809L12.7423 5.09986L2.04858 1Z"
                  fill="#E27625"
                  stroke="#E27625"
                  strokeWidth="0.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M28.2292 23.5335L24.7497 28.8721L32.2435 30.9307L34.4193 23.6501L28.2292 23.5335Z"
                  fill="#E27625"
                  stroke="#E27625"
                  strokeWidth="0.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0.600098 23.6501L2.76379 30.9307L10.2457 28.8721L6.77817 23.5335L0.600098 23.6501Z"
                  fill="#E27625"
                  stroke="#E27625"
                  strokeWidth="0.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.86285 14.6089L7.77346 17.7693L15.1742 18.1033L14.9353 10.1089L9.86285 14.6089Z"
                  fill="#E27625"
                  stroke="#E27625"
                  strokeWidth="0.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M25.1371 14.6089L20.0045 10.0178L19.8239 18.1033L27.2246 17.7693L25.1371 14.6089Z"
                  fill="#E27625"
                  stroke="#E27625"
                  strokeWidth="0.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.2457 28.8721L14.7086 26.7062L10.8856 23.7028L10.2457 28.8721Z"
                  fill="#E27625"
                  stroke="#E27625"
                  strokeWidth="0.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20.2915 26.7062L24.7497 28.8721L24.1145 23.7028L20.2915 26.7062Z"
                  fill="#E27625"
                  stroke="#E27625"
                  strokeWidth="0.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Conectar Metamask
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

