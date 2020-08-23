export const readCookie = (key: string): string | null => {
  const reg = new RegExp(`.*(?:${key})=([^;]+)`, 's'),
    match = document.cookie.match(reg)
  return match ? match[1] : null
}
