export const metadata = {
  title: 'LINE P2P App',
  description: 'LINE風チャット＆P2P通話アプリ',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
