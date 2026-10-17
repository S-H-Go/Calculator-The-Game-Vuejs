import { ButtonEnum } from './interface'

export type ParsedButton
  = | { type: 'empty' }
    | { type: 'single', token: ButtonEnum }
    | { type: 'arithmetic', operator: '+' | '-' | 'x' | '/', value: number }
    | { type: 'insert', value: number }
    | { type: 'replace', from: string, to: string }
    | { type: 'each', operator: '+' | '-' | 'x' | '/', value: number }

const singleButtons = new Set<string>(Object.values(ButtonEnum))

export function parseButtonToken(token: string): ParsedButton | null {
  if (token === '')
    return { type: 'empty' }

  if (singleButtons.has(token))
    return { type: 'single', token: token as ButtonEnum }

  if (token.startsWith('insert'))
    return { type: 'insert', value: Number(token.slice(6)) }

  if (token.startsWith('each'))
    return { type: 'each', operator: token[4] as '+' | '-' | 'x' | '/', value: Number(token.slice(5)) }

  if (token.includes('=>')) {
    const [from, to] = token.split('=>')
    return { type: 'replace', from, to }
  }

  if (/^[+\-x/]-?\d+$/.test(token))
    return { type: 'arithmetic', operator: token[0] as '+' | '-' | 'x' | '/', value: Number(token.slice(1)) }

  return null
}

export function getButtonClass(token: string): string {
  const parsed = parseButtonToken(token)
  if (!parsed)
    return 'color-button-green'

  switch (parsed.type) {
    case 'empty':
      return 'color-button-empty'
    case 'insert':
      return 'color-button-blue'
    case 'arithmetic':
      return 'color-button-grey'
    case 'single':
      switch (parsed.token) {
        case ButtonEnum.CLR:
          return 'color-button-clr'
        case ButtonEnum.OK:
          return 'color-button-green'
        case ButtonEnum.Store:
          return 'color-button-purple'
        case ButtonEnum.set:
          return 'color-button-yellow'
        case ButtonEnum.LevelIncrease:
        case ButtonEnum.LevelReduction:
          return 'color-button-6c96b6'
        default:
          return 'color-button-orange'
      }
    default:
      return 'color-button-orange'
  }
}

export function getButtonText(token: string, fallback?: string | number): string {
  const parsed = parseButtonToken(token)
  if (!parsed)
    return token

  switch (parsed.type) {
    case 'empty':
      return ''
    case 'insert':
      return String(parsed.value)
    case 'replace':
      return `${parsed.from}=>${parsed.to}`
    case 'each':
      return `[${parsed.operator}]${parsed.value}`
    case 'arithmetic':
      return `${parsed.operator} ${parsed.value}`
    case 'single':
      if (parsed.token === ButtonEnum.Store && fallback !== undefined)
        return String(fallback)
      if (parsed.token === ButtonEnum.set)
        return '设置'
      return parsed.token
  }
}

export function isPreviewButtonToken(token: string) {
  return parseButtonToken(token) !== null && token !== ButtonEnum.empty
}
