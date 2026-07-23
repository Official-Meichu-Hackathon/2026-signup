# Apps Script backend

`Code.gs` is the Google Apps Script Web App that appends registration rows to
the linked Google Sheet. It is deployed inside Google (Apps Script editor), not
built by this repo — keep this copy in sync with the deployed script.

## Row schema

Row layout is produced by `frontend/src/lib/submit.ts` (`buildRows`) and mirrored
in the comment at the top of `Code.gs`. Columns per player:

```
name, gender, birthday, idNumber, identity, school, department, grade,
occupation, email, phone, dietaryRestrictions, shirtSize,
selfIntro, motivation, project, competitionExp   ← 參賽者經歷 (added)
```

## Deploy

1. Open the bound Apps Script project from the Google Sheet.
2. Paste `Code.gs`.
3. Deploy as Web App: **Execute as: Me**, **Who has access: Anyone**.
4. Put the `/exec` URL in the frontend `VITE_APPS_SCRIPT_URL`.

## ⚠️ Sheet header columns — manual step

Adding the 4 `參賽者經歷` fields shifts every column after `shirtSize` right by
4. Update the Google Sheet header row to insert these 4 columns (per player
block) **before** `assentFirst` / player-continuation cells, so existing
formulas and views line up with the new payload. `appendRow` writes positionally
— the sheet header must match the new order.
