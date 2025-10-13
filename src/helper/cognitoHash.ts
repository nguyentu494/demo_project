import crypto from "crypto";

/**
 * Generate Cognito Secret Hash
 * @param username user's username or email
 * @returns Base64-encoded HMAC-SHA256 hash
 */
export function generateSecretHash(username: string) {
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
  const clientSecret = process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET!;

  const hmac = crypto.createHmac("SHA256", clientSecret);
  hmac.update(username + clientId);
  return hmac.digest("base64");
}
