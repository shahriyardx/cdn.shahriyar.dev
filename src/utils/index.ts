const illegalRe = /[\/\?<>\\:\*\|"]/g
const controlRe = /[\x00-\x1f\x80-\x9f]/g
const reservedRe = /^\.+$/
const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i
const windowsTrailingRe = /[\. ]+$/

const sanitize = (input: string, replacement: string) => {
  return input
    .replace(illegalRe, replacement)
    .replace(controlRe, replacement)
    .replace(reservedRe, replacement)
    .replace(windowsReservedRe, replacement)
    .replace(windowsTrailingRe, replacement)
}

export const getSafeFileName = (name: string) => {
  return sanitize(name, "_")
}

export const saveFile = (path: string, buffer: ArrayBuffer) => {}
