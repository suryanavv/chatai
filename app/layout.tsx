import type { Metadata } from "next";
import { Poppins, Instrument_Serif } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const instrumentalSerif = Instrument_Serif({
  variable: "--font-instrumental-serif",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "AI Chat Assistant",
  description: "Multi-provider AI chat application with OpenAI, Google, Anthropic, and OpenRouter support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${instrumentalSerif.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
