export function getDateKey(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function calculateAgeFromBirthDate(birthDate: string, referenceDate: string) {
  if (!birthDate) {
    return 0
  }

  const birth = new Date(`${birthDate}T12:00:00`)
  const reference = new Date(`${referenceDate}T12:00:00`)

  if (Number.isNaN(birth.getTime()) || Number.isNaN(reference.getTime())) {
    return 0
  }

  let age = reference.getFullYear() - birth.getFullYear()
  const hasHadBirthdayThisYear =
    reference.getMonth() > birth.getMonth() ||
    (reference.getMonth() === birth.getMonth() && reference.getDate() >= birth.getDate())

  if (!hasHadBirthdayThisYear) {
    age -= 1
  }

  return Math.max(age, 0)
}

export function getWeekKey(date: Date) {
  const normalized = new Date(date)
  const day = normalized.getDay()
  const diff = day === 0 ? -6 : 1 - day
  normalized.setDate(normalized.getDate() + diff)
  return getDateKey(normalized)
}

export function shiftDateKey(dateKey: string, days: number) {
  const nextDate = new Date(`${dateKey}T12:00:00`)
  nextDate.setDate(nextDate.getDate() + days)
  return getDateKey(nextDate)
}

export function formatDateLabel(dateKey: string) {
  const date = new Date(`${dateKey}T12:00:00`)
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
  }).format(date)
}

export function formatWeekLabel(weekKey: string) {
  const startDate = new Date(`${weekKey}T12:00:00`)
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6)

  const formatter = new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'short',
  })

  return `${formatter.format(startDate)} al ${formatter.format(endDate)}`
}

export function weekKeyToInputValue(weekKey: string) {
  const date = new Date(`${weekKey}T12:00:00`)
  const year = date.getFullYear()
  const januaryFirst = new Date(year, 0, 1)
  const days = Math.floor((date.getTime() - januaryFirst.getTime()) / 86400000)
  const week = Math.ceil((days + januaryFirst.getDay() + 1) / 7)
  return `${year}-W${`${week}`.padStart(2, '0')}`
}

export function inputWeekToWeekKey(inputWeek: string) {
  const [year, weekPart] = inputWeek.split('-W')
  const week = Number(weekPart)
  const simple = new Date(Number(year), 0, 1 + (week - 1) * 7)
  const dayOfWeek = simple.getDay()
  const monday = new Date(simple)

  if (dayOfWeek <= 4 && dayOfWeek !== 0) {
    monday.setDate(simple.getDate() - dayOfWeek + 1)
  } else if (dayOfWeek === 0) {
    monday.setDate(simple.getDate() - 6)
  } else {
    monday.setDate(simple.getDate() + 8 - dayOfWeek)
  }

  return getDateKey(monday)
}
