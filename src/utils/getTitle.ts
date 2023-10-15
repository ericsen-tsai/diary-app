function getTitle(md: string) {
  if (!md) return ''
  const tokens = md.split('\n')
  for (let i = 0; i < tokens.length; i += 1) {
    if (/^#\s+.+/.test(tokens[i])) return tokens[i].split('# ')[1]
  }
  return ''
}

export default getTitle
