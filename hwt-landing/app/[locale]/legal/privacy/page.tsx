import enMessages from '@/messages/en-us.json'
import ptMessages from '@/messages/pt-br.json'

export default async function PrivacyPolicy({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = locale === 'en-us' ? enMessages : ptMessages
  const t = messages.privacy
  
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
      <p className="mb-4">{t.intro}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">{t.section1.title}</h2>
      <p className="mb-4">{t.section1.content}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">{t.section2.title}</h2>
      <p className="mb-2">{t.section2.intro}</p>
      <ul className="list-disc ml-6 mb-4">
        <li>{t.section2.items[0]}</li>
        <li>{t.section2.items[1]}</li>
        <li>{t.section2.items[2]}</li>
        <li>{t.section2.items[3]}</li>
      </ul>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">{t.section3.title}</h2>
      <p className="mb-4">{t.section3.content}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">{t.section4.title}</h2>
      <p className="mb-4">{t.section4.content}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">{t.section5.title}</h2>
      <p className="mb-4">{t.section5.content}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">{t.section6.title}</h2>
      <p className="mb-4">{t.section6.content}</p>
    </div>
  )
}
