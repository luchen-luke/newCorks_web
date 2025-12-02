// Fallback declaration for bcryptjs to avoid TypeScript errors
declare module 'bcryptjs' {
  const bcrypt: any
  export default bcrypt
}
