import { Inter, Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "Free-Play | Watch Movies & Anime Free",
  description: "High-quality streaming for movies, anime, and series. Enjoy the latest releases for free on Free-Play.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider 
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#3b82f6",
          colorBackground: "#020617",
          colorText: "#ffffff",
          colorTextSecondary: "#ffffff",
          colorInputBackground: "#0f172a",
          colorInputText: "#ffffff",
          colorTextOnPrimaryBackground: "#ffffff",
        },
        elements: {
          card: {
            backgroundColor: "#0f172a",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            color: "#ffffff !important"
          },
          headerTitle: { color: "#ffffff !important" },
          headerSubtitle: { color: "#ffffff !important" },
          socialButtonsBlockButtonText: { color: "#ffffff !important" },
          formFieldLabel: { color: "#ffffff !important" },
          formFieldInput: { color: "#ffffff !important", backgroundColor: "#0f172a !important" },
          dividerText: { color: "#ffffff !important" },
          footerActionText: { color: "#ffffff !important" },
          footerActionLink: { color: "#3b82f6 !important" },
          identityPreviewText: { color: "#ffffff !important" },
          
          // MAXIMUM OVERRIDE FOR USER BUTTON
          userButtonPopoverCard: {
            backgroundColor: "#0f172a !important",
            border: "1px solid rgba(255, 255, 255, 0.2) !important",
            color: "#ffffff !important"
          },
          userButtonPopoverMain: {
            backgroundColor: "#0f172a !important",
            color: "#ffffff !important"
          },
          userButtonPopoverDisplaySection: {
            color: "#ffffff !important"
          },
          userButtonDisplayName: {
            color: "#ffffff !important",
            fontSize: "1.2rem !important",
            fontWeight: "800 !important"
          },
          userButtonDisplayEmailAddress: {
            color: "#ffffff !important",
            opacity: "1 !important"
          },
          userPreviewSecondaryIdentifier: {
            color: "#ffffff !important",
            opacity: "1 !important",
            fontWeight: "500 !important"
          },
          userPreviewMainIdentifier: {
            color: "#ffffff !important"
          },
          userButtonPopoverActionButton: {
            color: "#ffffff !important"
          },
          userButtonPopoverActionButtonText: {
            color: "#ffffff !important",
            fontWeight: "600 !important"
          },
          userButtonPopoverActionButtonIcon: {
            color: "#3b82f6 !important"
          },
          userButtonPopoverFooter: {
            display: "none"
          },
          // Fallback selectors
          "user-button-popover-display-name": { color: "#ffffff !important" },
          "user-button-popover-display-email": { color: "#ffffff !important" }
        }
      }}
    >
      <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
