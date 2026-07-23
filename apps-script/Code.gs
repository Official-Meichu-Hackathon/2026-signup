// Merged 2025 + 2026 style.
// Requires the "Sheets" Advanced Service enabled (Services ➜ + ➜ Google Sheets API).
//
// Leave SHEET_ID empty when container-bound to the Sheet; set it to run standalone.
var SHEET_ID = ''
var SHEET_NAME = 'Sheet1'
// Table anchor for Values.append — data rows start here (rows above are headers).
var APPEND_RANGE = SHEET_NAME + '!A5'

var MAX_ROWS_PER_SUBMISSION = 5
// [timestamp, groupName, playerCount, crossDomain, priority1..8,
//  17 player fields (13 basic + selfIntro/motivation/project/competitionExp),
//  assentFirst, assentSecond, lowIncomeProofFilename,
//  workshopAttendance, ceremonyAttendance]
var ROW_LENGTH = 34
var EMAIL_COL = 21
var MAX_CELL_LEN = 500

// TODO: confirm 2026 contact + archive addresses
var CONTACT_EMAIL = 'ooixinsheng12345@gmail.com'
var ARCHIVE_BCC = 'ooixinsheng@gapp.nthu.edu.tw'
var SENDER_NAME = 'test'

// Browser GET hits this — the form only uses doPost. Stub avoids the
// "Script function not found: doGet" error page.
function doGet() {
  return json_({ ok: true, message: 'POST only' })
}

function doPost(e) {
  // Lock (from 2026): serialize concurrent submits so team rows never interleave.
  var lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    var rows = JSON.parse(e.postData.contents)
    validate_(rows)

    rows[0][0] = new Date()
    appendRows_(rows)

    // Email failure must not fail the submission — data is already saved.
    var emailSent = false
    try {
      emailSent = sendConfirmationEmail_(rows)
    } catch (err) {
      Logger.log('confirmation email failed: ' + err)
    }

    return json_({ ok: true, emailSent: emailSent })
  } catch (err) {
    Logger.log(err)
    return json_({ ok: false, error: String(err) })
  } finally {
    lock.releaseLock()
  }
}

// Advanced Sheets API append (from 2025): auto-grows the sheet, appends the
// whole team block in one call, no padding / getRange math.
function appendRows_(rows) {
  var spreadsheetId = SHEET_ID || SpreadsheetApp.getActiveSpreadsheet().getId()
  var valueRange = Sheets.newValueRange()
  valueRange.values = rows
  Sheets.Spreadsheets.Values.append(valueRange, spreadsheetId, APPEND_RANGE, {
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
  })
}

// Strict validation (from 2026): typed cells, length caps, clear errors.
function validate_(rows) {
  if (!Array.isArray(rows)) throw new Error('Payload must be an array of rows')
  if (rows.length < 1 || rows.length > MAX_ROWS_PER_SUBMISSION) {
    throw new Error('Row count out of range')
  }
  for (var i = 0; i < rows.length; i++) {
    if (!Array.isArray(rows[i])) throw new Error('Row ' + i + ' is not an array')
    if (rows[i].length > ROW_LENGTH) {
      throw new Error('Row ' + i + ' has too many columns')
    }
    for (var j = 0; j < rows[i].length; j++) {
      var cell = rows[i][j]
      if (cell !== null && typeof cell !== 'string') {
        throw new Error('Row ' + i + ' col ' + j + ' must be string or null')
      }
      if (typeof cell === 'string' && cell.length > MAX_CELL_LEN) {
        throw new Error('Row ' + i + ' col ' + j + ' exceeds ' + MAX_CELL_LEN + ' chars')
      }
    }
  }
  if (rows[0].length !== ROW_LENGTH) {
    throw new Error('First row must have exactly ' + ROW_LENGTH + ' columns')
  }
  // First row must carry the team fields.
  if (!rows[0][1] || !rows[0][2] || !rows[0][3]) {
    throw new Error('Missing required team fields')
  }
}

function collectEmails_(rows) {
  var isEmail = function (s) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || '').trim())
  }
  var emails = rows
    .map(function (row) {
      return row && row[EMAIL_COL] ? String(row[EMAIL_COL]).trim() : ''
    })
    .filter(isEmail)
  return [...new Set(emails)]
}

// Mask 身分證字號 / 統一證號 for the confirmation email (sheet keeps full value).
// All variants are 10 chars, so show first 3 + last 2, star the middle.
function maskId_(value) {
  var s = String(value == null ? '' : value).trim()
  if (s.length <= 5) return s // too short to mask meaningfully
  return s.slice(0, 3) + '*'.repeat(s.length - 5) + s.slice(-2)
}

// HTML escape (from 2026): confirmation email is user-data driven.
function esc_(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Email body as a template literal (from 2025): readable, close to the markup.
function sendConfirmationEmail_(rows) {
  var recipients = collectEmails_(rows)
  if (recipients.length === 0) return false

  var first = rows[0]

  var priorityItems = ''
  for (var p = 4; p <= 11; p++) {
    priorityItems += `<li>${esc_(first[p])}</li>`
  }

  var playerSections = rows
    .map(
      (row, i) => `<h2>參賽者 ${i + 1} 個人資訊</h2>
<ul>
  <li><strong>姓名：</strong>${esc_(row[12])}</li>
  <li><strong>生理性別：</strong>${esc_(row[13])}</li>
  <li><strong>生日：</strong>${esc_(row[14])}</li>
  <li><strong>身分證字號：</strong>${esc_(maskId_(row[15]))}</li>
  <li><strong>身分：</strong>${esc_(row[16])}</li>
  <li><strong>就讀學校：</strong>${esc_(row[17])}</li>
  <li><strong>科系：</strong>${esc_(row[18])}</li>
  <li><strong>年級：</strong>${esc_(row[19])}</li>
  <li><strong>職業：</strong>${esc_(row[20])}</li>
  <li><strong>Email：</strong>${esc_(row[21])}</li>
  <li><strong>手機號碼：</strong>${esc_(row[22])}</li>
  <li><strong>特殊飲食習慣：</strong>${esc_(row[23])}</li>
  <li><strong>衣服尺寸：</strong>${esc_(row[24])}</li>
</ul>`,
    )
    .join('\n\n')

  var htmlBody = `<h1>【梅竹黑客松 2026】報名確認通知</h1>
<p>親愛的參賽者，您好！</p>
<p>感謝您報名參加 2026 梅竹黑客松，以下是您的報名資料，請確認是否正確：</p>
<hr>
<h2>隊伍資訊</h2>
<ul>
  <li><strong>隊伍名稱：</strong>${esc_(first[1])}</li>
  <li><strong>隊伍人數：</strong>${esc_(first[2])}</li>
  <li><strong>跨域組隊：</strong>${esc_(first[3])}</li>
</ul>
<h2>志願序</h2>
<ol>${priorityItems}</ol>
<hr>
${playerSections}
<hr>
<h2>同意書與其他</h2>
<ul>
  <li><strong>個人資料搜集、處理及利用之告知暨同意書：</strong>${esc_(first[29])}</li>
  <li><strong>智慧財產權聲明暨授權同意書：</strong>${esc_(first[30])}</li>
  <li><strong>清寒證明：</strong>${first[31] ? '有' : '無'}</li>
  <li><strong>是否全程參與工作坊：</strong>${esc_(first[32])}</li>
  <li><strong>是否全程參與開幕、閉幕：</strong>${esc_(first[33])}</li>
</ul>
<hr>
<h2>聯絡資訊</h2>
<p>如您發現資料有誤或有任何疑問，請透過以下方式聯繫我們：</p>
<ul>
  <li><strong>Email：</strong>${CONTACT_EMAIL}</li>
  <li>或直接回覆此信件</li>
</ul>
<p>感謝您的參與，期待在 2026 梅竹黑客松與您相見！</p>
<p><strong>梅竹黑客松團隊 敬上</strong></p>`

  var bccList = [ARCHIVE_BCC].concat(recipients.slice(1))
  GmailApp.sendEmail(recipients[0], '【梅竹黑客松2026】報名確認通知', '', {
    name: SENDER_NAME,
    htmlBody: htmlBody,
    bcc: bccList.join(', '),
    replyTo: CONTACT_EMAIL,
  })
  return true
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  )
}
