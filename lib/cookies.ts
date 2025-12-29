/**
 * Cookie utility functions for managing last used social login provider
 */

export type SocialProvider = "google" | "github" | "linkedin";

const LAST_USED_PROVIDER_COOKIE = "last-used-social-provider";
const COOKIE_EXPIRY_DAYS = 30;

/**
 * Set the last used social provider in a cookie
 */
export function setLastUsedProvider(provider: SocialProvider): void {
  if (typeof document === "undefined") return; // SSR safety

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);

  document.cookie = `${LAST_USED_PROVIDER_COOKIE}=${provider}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * Get the last used social provider from cookies
 */
export function getLastUsedProvider(): SocialProvider | null {
  if (typeof document === "undefined") return null; // SSR safety

  const cookies = document.cookie.split(";");
  const providerCookie = cookies.find((cookie) => cookie.trim().startsWith(`${LAST_USED_PROVIDER_COOKIE}=`));

  if (!providerCookie) return null;

  const provider = providerCookie.split("=")[1]?.trim();

  // Validate that the provider is one of our supported types
  if (provider && ["google", "github", "linkedin"].includes(provider)) {
    return provider as SocialProvider;
  }

  return null;
}

/**
 * Clear the last used provider cookie
 */
export function clearLastUsedProvider(): void {
  if (typeof document === "undefined") return; // SSR safety

  document.cookie = `${LAST_USED_PROVIDER_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
