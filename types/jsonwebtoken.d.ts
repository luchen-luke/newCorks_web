// Fallback declaration for jsonwebtoken in case @types/jsonwebtoken is missing/partial
declare module 'jsonwebtoken' {
  import type { Secret, SignOptions, VerifyOptions } from 'jsonwebtoken'
  const jwt: any
  export default jwt
}
