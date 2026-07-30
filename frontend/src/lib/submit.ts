import { PRIORITY_OPTIONS, type RegistrationData } from './types'
import { SIGNUP_OPEN } from './signupOpen'

type SheetCell = string | null

// Fixed number of 志願序 columns; both branches pad to this width.
const PRIORITY_WIDTH = PRIORITY_OPTIONS.length

// Row layout matches the 2026 sheet schema (see apps-script/README.md):
// [timestamp, groupName, playerCount, crossDomain, priority1..8,
//  name, gender, birthday, idNumber, identity, school, department, grade,
//  occupation, email, phone, dietaryRestrictions, shirtSize,
//  selfIntro, motivation, project, competitionExp,
//  assentFirst, assentSecond, lowIncomeProofFilename,
//  workshopAttendance, ceremonyAttendance]
// The timestamp cell is filled in by the Apps Script.
export function buildRows(data: RegistrationData): SheetCell[][] {
  const playerCount = parseInt(data.playerCountChoice, 10)
  const players = data.players.slice(0, playerCount)

  const priority: SheetCell[] = [...data.priorityOrder]
  while (priority.length < PRIORITY_WIDTH) {
    priority.push(null)
  }

  const playerCells = (player: RegistrationData['players'][number]) => [
    player.name,
    player.gender,
    player.birthday,
    player.idNumber,
    player.identity,
    player.school,
    player.department,
    player.grade,
    player.occupation,
    player.email,
    player.phone,
    player.dietaryRestrictions,
    player.shirtSize,
    player.selfIntro,
    player.motivation,
    player.project,
    player.competitionExp,
  ]

  const firstRow: SheetCell[] = [
    null,
    data.groupName,
    data.playerCountChoice,
    data.isCrossDomain,
    ...priority,
    ...playerCells(players[0]),
    // The two consents merged into one question, but the sheet still has two
    // columns, so the single answer fills both.
    data.assent,
    data.assent,
    data.lowIncomeProof ? data.lowIncomeProof.name : '',
    data.workshopAttendance,
    data.ceremonyAttendance,
  ]

  const otherRows: SheetCell[][] = players
    .slice(1)
    .map((player) => [
      null,
      null,
      null,
      null,
      ...Array<SheetCell>(PRIORITY_WIDTH).fill(null),
      ...playerCells(player),
    ])

  return [firstRow, ...otherRows]
}

export async function submitRegistration(
  data: RegistrationData,
): Promise<void> {
  if (!SIGNUP_OPEN) {
    throw new Error('報名尚未開始')
  }

  const url = import.meta.env.VITE_APPS_SCRIPT_URL
  if (!url) {
    throw new Error('VITE_APPS_SCRIPT_URL is not set')
  }

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(buildRows(data)),
    // text/plain avoids the CORS preflight that Apps Script cannot answer
    headers: { 'Content-Type': 'text/plain' },
    redirect: 'follow',
  })

  if (!response.ok) {
    throw new Error(`Submission failed with status ${response.status}`)
  }

  const result = (await response.json()) as { ok: boolean; error?: string }
  if (!result.ok) {
    throw new Error(result.error || 'Submission rejected by server')
  }
}
