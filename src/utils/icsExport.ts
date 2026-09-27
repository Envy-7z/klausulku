import type { KeyDate } from '../types'

function escapeIcsText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

function formatIcsDate(isoDate: string): string {
  const d = isoDate.slice(0, 10).replace(/-/g, '')
  return d
}

function buildIcsEvent(date: KeyDate, documentTitle: string): string {
  if (!date.isoDate) return ''

  const uid = `${crypto.randomUUID()}@klausulku.app`
  const dtStart = formatIcsDate(date.isoDate)
  const summary = escapeIcsText(`${date.label} — ${documentTitle}`)

  return [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatIcsDate(new Date().toISOString())}T000000Z`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${escapeIcsText(date.rawText)}`,
    'END:VEVENT',
  ].join('\r\n')
}

export function downloadIcsFile(date: KeyDate, documentTitle: string): void {
  const event = buildIcsEvent(date, documentTitle)
  if (!event) return

  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//KlausulKu//ID', event, 'END:VCALENDAR'].join(
    '\r\n'
  )

  triggerDownload(ics, `klausulku-${date.label.replace(/\s+/g, '-').toLowerCase()}.ics`)
}

export function downloadAllKeyDates(dates: KeyDate[], documentTitle: string): void {
  const events = dates.map((d) => buildIcsEvent(d, documentTitle)).filter(Boolean)
  if (events.length === 0) return

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//KlausulKu//ID',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n')

  triggerDownload(ics, `klausulku-tanggal-penting.ics`)
}

function triggerDownload(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
