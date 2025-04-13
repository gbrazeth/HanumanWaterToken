declare module "next/server" {
    export class NextResponse {
      static json(body: any, init?: ResponseInit): Response
      static redirect(url: string | URL, init?: ResponseInit): Response
      static rewrite(destination: string | URL, init?: ResponseInit): Response
      static next(init?: ResponseInit): Response
    }
  
    export type NextRequest = Request & {
      nextUrl: URL
      cookies: {
        get(name: string): { name: string; value: string } | undefined
        getAll(): { name: string; value: string }[]
        set(name: string, value: string, options?: { path?: string; maxAge?: number }): void
        delete(name: string): void
      }
    }
  }
  