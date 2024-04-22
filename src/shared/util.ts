import { SetMetadata } from '@nestjs/common'
import dayjs, { ManipulateType, UnitType } from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { customAlphabet } from 'nanoid'

dayjs.extend(utc)

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

const ALPHA_NUMERIC = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
export const DEFAULT_FORMAT = 'YYYY-MM-DD'

export const toId = (size = 16) => customAlphabet(ALPHA_NUMERIC, size)()

export const toCurrency = (val: number, currency = 'USD') => {
  return val.toLocaleString('en-US', { currency, style: 'currency', maximumFractionDigits: 0 })
}

export const dateToStr = (dt: Date | string | null, tzOffset: number, tz?: string | null, format?: string) => {
  let d = dayjs(dt)
  if (tz && parseInt(tz) !== tzOffset) d = d.add(+tz * -1, 'minute')
  return d.format(format || DEFAULT_FORMAT)
}

export const addDateToStr = (
  dt: Date | string | null,
  tzOffset: number,
  add: number,
  unit: ManipulateType,
  tz?: string,
  format?: string
) => {
  let d = dayjs(dt).add(add, unit)
  if (tz && parseInt(tz) !== tzOffset) d = d.add(+tz * -1, 'minute')
  return d.format(format || DEFAULT_FORMAT)
}

export const strToDate = (str: string, tzOffset: number, startOrEnd?: 'start' | 'end', tz?: string) => {
  let d = dayjs(str).utc()

  if (startOrEnd === 'start') {
    if (tz && parseInt(tz) !== tzOffset) d = d.add(+tz, 'minute')
  } else if (startOrEnd === 'end') {
    d = d.add(1, 'day')
    if (tz && parseInt(tz) !== tzOffset) {
      d = d.add(+tz, 'minute')
    }
  }

  return d.toDate()
}

export const isBefore = (d1: string | Date, d2: string | Date) => {
  return dayjs(d1).isBefore(d2)
}

export const diff = (d1: string | Date | null, unit: UnitType, d2?: Date | string) => {
  return dayjs(d1).diff(d2, unit)
}

export const now = (input?: string | number | Date) => dayjs(input)

export const getDateTime = (offset: number, range?: number) => {
  // create Date object for current location
  const d = new Date()

  // convert to msec
  // subtract local time zone offset
  // get UTC time in msec
  const utc = d.getTime() + d.getTimezoneOffset() * 60000

  // create new Date object for different city
  // using supplied offset
  const nd = new Date(utc + 3600000 * offset)

  const year = nd.getFullYear()
  const month = (nd.getMonth() + 1).toString().padStart(2, '0')
  const day = nd.getDate().toString().padStart(2, '0')
  const hour = nd.getHours().toString().padStart(2, '0')
  const minute = (Math.floor(nd.getMinutes() / (range || 1)) * (range || 1)).toString().padStart(2, '0')

  // return date, time
  return { date: `${year}-${month}-${day}`, time: `${hour}:${minute}`, hour, minute }
}
