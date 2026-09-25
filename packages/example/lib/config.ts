/**
 * Environment flags
 */
export const isDevelopment = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_VERCEL_ENV === "development";
export const isPreview = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";
export const isProduction =
	process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

/**
 * Domain names
 */
export const DOMAIN_NAME = "mrbd.fun";

/**
 * URLS for the application
 */
export const BASE_URL = isDevelopment ? "localhost:3000" : isPreview ? process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL : DOMAIN_NAME;
export const APP_URL = `${isDevelopment ? "http://" : "https://"}${BASE_URL}`;

/**
 * OpenReplay
 */
export const OPENREPLAY_PROJECT_KEY = process.env.NEXT_PUBLIC_OPENREPLAY_PROJECT_KEY;
