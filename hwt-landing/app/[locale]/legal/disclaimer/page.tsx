import enMessages from '@/messages/en-us.json'
import ptMessages from '@/messages/pt-br.json'

export default async function Disclaimer({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = locale === 'en-us' ? enMessages : ptMessages
  const t = messages.disclaimer
  
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
      <ul className="list-disc ml-6 mb-4">
        {t.items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
