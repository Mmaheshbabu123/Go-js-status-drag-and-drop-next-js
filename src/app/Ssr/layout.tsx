export const metadata = {
  title: 'Mahesh SSr',
  description: 'Generated by Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

<>
      {children}
      <h1>SSR footer layout</h1>
</>

  )
}
