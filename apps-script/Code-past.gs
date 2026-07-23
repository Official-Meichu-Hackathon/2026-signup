const sheetId = '14kKrn3PkQLPepMSijBIWLZ_3wET980ZnCpS3_EhFDRs';

const isTwoDimensionalArray = (arr) => {
  if (!Array.isArray(arr)) return false;
    if (arr.length === 0) return true;
      return arr.every(innerArray => Array.isArray(innerArray));
      };

      const collectEmails = (rows) => {
        const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || '').trim());
          const emails = rows
              .map(r => (r && r[20]) ? String(r[20]).trim() : '')
                  .filter(e => e && isEmail(e));
                    return [...new Set(emails)];
                    };

                    const doPost = (e) => {
                      const data = JSON.parse(e.postData.contents);

                        if (!isTwoDimensionalArray(data) || data.length > 5 || data.some((value) => value.length > 50) || data[0].length != 28) {
                            return ContentService
                                  .createTextOutput(JSON.stringify({ error: 'A valid value should be returned' }))
                                        .setMimeType(ContentService.MimeType.JSON);
                                          }

                                            data[0][0] = new Date();

                                              try {
                                                  const valueRange = Sheets.newValueRange();
                                                      valueRange.values = data;
                                                          Sheets.Spreadsheets.Values.append(valueRange, sheetId, 'A5', { valueInputOption: 'USER_ENTERED' });
                                                            } catch (err) {
                                                                Logger.log(err);
                                                                  }

                                                                    try {
                                                                        const recipients = collectEmails(data);
                                                                            if (recipients.length === 0) {
                                                                                  return ContentService
                                                                                          .createTextOutput(JSON.stringify({ result: 'no email' }))
                                                                                                  .setMimeType(ContentService.MimeType.JSON);
                                                                                                      }

                                                                                                          const emailContent = `<h1>【梅竹黑客松 2025】報名確認通知</h1>

                                                                                                          <p>親愛的參賽者，您好！</p>

                                                                                                          <p>感謝您報名參加2025梅竹黑客松，以下是您的報名資料，請確認是否正確：</p>

                                                                                                          <hr>

                                                                                                          <h2>隊伍資訊</h2>

                                                                                                          <ul>
                                                                                                              <li><strong>隊伍名稱：</strong>${data[0][1]}</li>
                                                                                                                  <li><strong>隊伍人數：</strong>${data[0][2]}</li>
                                                                                                                      <li><strong>跨域組隊：</strong>${data[0][3]}</li>
                                                                                                                      </ul>

                                                                                                                      <h2>志願序</h2>
                                                                                                                      <ol>
                                                                                                                          <li>${data[0][4] || ''}</li>
                                                                                                                              <li>${data[0][5] || ''}</li>
                                                                                                                                  <li>${data[0][6] || ''}</li>
                                                                                                                                      <li>${data[0][7] || ''}</li>
                                                                                                                                          <li>${data[0][8] || ''}</li>
                                                                                                                                              <li>${data[0][9] || ''}</li>
                                                                                                                                                  <li>${data[0][10] || ''}</li>
                                                                                                                                                  </ol>

                                                                                                                                                  <hr>

                                                                                                                                                  ${data.map((_, i) => `<h2>參賽者 ${i+1} 個人資訊</h2>
                                                                                                                                                  <ul>
                                                                                                                                                      <li><strong>姓名：</strong>${data[i][11]}</li>
                                                                                                                                                          <li><strong>生理性別：</strong>${data[i][12]}</li>
                                                                                                                                                              <li><strong>生日：</strong>${data[i][13]}</li>
                                                                                                                                                                  <li><strong>身分證字號：</strong>${data[i][14]}</li>
                                                                                                                                                                      <li><strong>身份：</strong>${data[i][15]}</li>
                                                                                                                                                                          <li><strong>就讀學校：</strong>${data[i][16]}</li>
                                                                                                                                                                              <li><strong>科系：</strong>${data[i][17]}</li>
                                                                                                                                                                                  <li><strong>年級：</strong>${data[i][18]}</li>
                                                                                                                                                                                      <li><strong>職業：</strong>${data[i][19]}</li>
                                                                                                                                                                                          <li><strong>Email：</strong>${data[i][20]}</li>
                                                                                                                                                                                              <li><strong>手機號碼：</strong>${data[i][21]}</li>
                                                                                                                                                                                                  <li><strong>特殊飲食習慣：</strong>${data[i][22]}</li>
                                                                                                                                                                                                      <li><strong>衣服尺寸：</strong>${data[i][23]}</li>
                                                                                                                                                                                                          <li><strong>清寒證明：</strong>${data[i][24] ? '有' : '無'}</li>
                                                                                                                                                                                                          </ul>`).join('\n\n')}<hr>

                                                                                                                                                                                                          <h2>同意書</h2>
                                                                                                                                                                                                          <ul>
                                                                                                                                                                                                              <li><strong>個人資料搜集、處理及利用之告知暨同意書：</strong>${data[0][25]}</li>
                                                                                                                                                                                                                  <li><strong>智慧財產權聲明暨授權同意書：</strong>${data[0][26]}</li>
                                                                                                                                                                                                                      <li><strong>報名須知：</strong>${data[0][27]}</li>
                                                                                                                                                                                                                      </ul>

                                                                                                                                                                                                                      <hr>

                                                                                                                                                                                                                      <h2>聯絡資訊</h2>
                                                                                                                                                                                                                      <p>如您發現資料有誤或有任何疑問，請透過以下方式聯繫我們：</p>
                                                                                                                                                                                                                      <ul>
                                                                                                                                                                                                                          <li><strong>Email：</strong>2025mchackathon@gmail.com</li>
                                                                                                                                                                                                                              <li>或直接回覆此信件</li>
                                                                                                                                                                                                                              </ul>

                                                                                                                                                                                                                              <p>感謝您的參與，期待在2025 梅竹黑客松與您相見！</p>

                                                                                                                                                                                                                              <p><strong>梅竹黑客松團隊 敬上</strong></p>`;

                                                                                                                                                                                                                                  const to = recipients[0];
                                                                                                                                                                                                                                      const bccList = ['mchackathondev@gmail.com', ...recipients.slice(1)];

                                                                                                                                                                                                                                          const draft = GmailApp.createDraft(
                                                                                                                                                                                                                                                to,
                                                                                                                                                                                                                                                      '【梅竹黑客松2025】 報名表單',
                                                                                                                                                                                                                                                            '',
                                                                                                                                                                                                                                                                  {
                                                                                                                                                                                                                                                                          name: '2025梅竹黑客松',
                                                                                                                                                                                                                                                                                  htmlBody: emailContent,
                                                                                                                                                                                                                                                                                          bcc: bccList.join(', '),
                                                                                                                                                                                                                                                                                                  replyTo: '2025mchackathon@gmail.com'
                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                            );
                                                                                                                                                                                                                                                                                                                draft.send();
                                                                                                                                                                                                                                                                                                                  } catch (err) {
                                                                                                                                                                                                                                                                                                                      Logger.log(err);
                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                          return ContentService
                                                                                                                                                                                                                                                                                                                              .createTextOutput(JSON.stringify({ result: 'success' }))
                                                                                                                                                                                                                                                                                                                                  .setMimeType(ContentService.MimeType.JSON);
                                                                                                                                                                                                                                                                                                                                  };

                                                                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                          )
                                                                            }
                                                                    }
                                                            }
                                              }
                        }
                    }
      }
}
