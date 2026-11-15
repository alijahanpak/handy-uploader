const warned = new Set<string>()

/** Logs a deprecation warning once per page load. */
export function warnDeprecated(name: string, replacement: string) {
  if (warned.has(name)) return
  warned.add(name)
  console.warn(
    `[handy-uploader] ${name}() is deprecated and will be removed in the next major version. ` +
      `Use ${replacement} instead.`
  )
}
