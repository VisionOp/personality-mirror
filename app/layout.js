import './globals.css'

export const metadata = {
  title: 'Personality Mirror - Discover Your True Self',
  description: 'A deep personality quiz that reveals your authentic self',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
