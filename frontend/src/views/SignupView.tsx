import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import FormShell from '../components/form/FormShell'
import { RAIL_SECTIONS, type Section } from '../components/form/railSections'
import FormStep from '../components/form/FormStep'
import TextQuestion from '../components/form/TextQuestion'
import ChoiceQuestion from '../components/form/ChoiceQuestion'
import SortableQuestion from '../components/form/SortableQuestion'
import FileUpload from '../components/form/FileUpload'
import PlayerTabs from '../components/form/PlayerTabs'
import {
  createPlayerData,
  GENDER_OPTIONS,
  IDENTITY_OPTIONS,
  MAKER_PRIORITY_OPTIONS,
  MAX_PLAYERS,
  PLAYER_COUNT_OPTIONS,
  PLAYER_ORDER_LABELS,
  PRIORITY_OPTIONS,
  SHIRT_SIZE_OPTIONS,
  type PlayerData,
} from '../lib/types'
import {
  isValidId,
  validateBirthday,
  validateEmail,
  validateGroupName,
  validatePhoneNumber,
} from '../lib/validators'
import { submitRegistration } from '../lib/submit'
import { trackSignUp } from '../lib/analytics'

const CONTACT_EMAIL = '2026mchackathon@gmail.com'

const CONSENT_PLACEHOLDER =
  'Lorem ipsum dolor sit amet consectetur. Neque ac odio scelerisque magnis ultrices feugiat tortor. Gravida sed in euismod tortor ipsum facilisis lorem. Ultrices ac pellentesque ac tellus consectetur. Arcu amet maecenas commodo a consequat scelerisque. Bibendum phasellus semper id dignissim in nibh ultrices id ut. Nibh pellentesque aliquam quam egestas et. Morbi ac sit nulla aliquam. Pellentesque placerat nibh mauris sit donec. Sed semper diam consectetur tempor scelerisque consequat lectus eu.'

interface SignupViewProps {
  onSuccess: () => void
}

function sectionForStep(currentStep: number, playerCount: number): Section {
  if (currentStep === 1) return 'option'
  if (currentStep <= playerCount + 1) return 'basic'
  if (currentStep === playerCount + 2) return 'consent'
  return 'other'
}

function firstStepOfSection(section: Section, playerCount: number): number {
  switch (section) {
    case 'option':
      return 1
    case 'basic':
      return 2
    case 'consent':
      return playerCount + 2
    case 'other':
      return playerCount + 3
  }
}

export default function SignupView({ onSuccess }: SignupViewProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  // ?ref=maker locks 志願序 to 創客交流組; default is the full enterprise list.
  const [searchParams] = useSearchParams()
  const isMaker = searchParams.get('ref') === 'maker'
  const priorityOptions = isMaker ? MAKER_PRIORITY_OPTIONS : PRIORITY_OPTIONS

  // step 1: 報名選項
  const [groupName, setGroupName] = useState('')
  const [playerCountChoice, setPlayerCountChoice] = useState('')
  const [isCrossDomain, setIsCrossDomain] = useState('')
  const [priorityOrder, setPriorityOrder] = useState<string[]>([
    ...priorityOptions,
  ])

  // Re-seed the list when the branch flips (?ref changing in place).
  const [prevIsMaker, setPrevIsMaker] = useState(isMaker)
  if (isMaker !== prevIsMaker) {
    setPrevIsMaker(isMaker)
    setPriorityOrder([...priorityOptions])
  }

  // steps 2..n: 參賽者基本資料
  const [players, setPlayers] = useState<PlayerData[]>(() =>
    Array.from({ length: MAX_PLAYERS }, () => createPlayerData()),
  )

  // 同意書
  const [assentFirst, setAssentFirst] = useState('')
  const [assentSecond, setAssentSecond] = useState('')

  // 其他
  const [lowIncomeProof, setLowIncomeProof] = useState<File | null>(null)
  const [workshopAttendance, setWorkshopAttendance] = useState('')
  const [ceremonyAttendance, setCeremonyAttendance] = useState('')

  const playerCount = playerCountChoice
    ? parseInt(playerCountChoice, 10)
    : MAX_PLAYERS
  const totalSteps = playerCount + 3

  useEffect(() => {
    window.onbeforeunload = () => ''
    return () => {
      window.onbeforeunload = null
    }
  }, [])

  const updatePlayer = (
    index: number,
    field: keyof PlayerData,
    value: PlayerData[keyof PlayerData],
  ) => {
    setPlayers((prev) =>
      prev.map((player, i) =>
        i === index ? { ...player, [field]: value } : player,
      ),
    )
  }

  const step1Ok =
    groupName.trim() !== '' &&
    validateGroupName(groupName) &&
    playerCountChoice !== '' &&
    isCrossDomain !== ''

  const playerOk = (player: PlayerData) =>
    player.name.trim() !== '' &&
    player.gender !== '' &&
    validateBirthday(player.birthday) &&
    isValidId(player.idNumber) &&
    player.identity !== '' &&
    player.school.trim() !== '' &&
    player.department.trim() !== '' &&
    player.grade.trim() !== '' &&
    player.occupation.trim() !== '' &&
    validateEmail(player.email) &&
    validatePhoneNumber(player.phone) &&
    player.dietaryRestrictions.trim() !== '' &&
    player.shirtSize !== ''

  const assentOk = assentFirst === '是' && assentSecond === '是'
  // 清寒證明 upload is optional despite the design's ★.
  const otherOk = workshopAttendance !== '' && ceremonyAttendance !== ''

  const submit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setSubmitError(false)
    try {
      await submitRegistration({
        groupName,
        playerCountChoice,
        isCrossDomain,
        priorityOrder,
        players,
        assentFirst,
        assentSecond,
        lowIncomeProof,
        workshopAttendance,
        ceremonyAttendance,
      })
      window.onbeforeunload = null
      trackSignUp()
      onSuccess()
    } catch (err) {
      console.error(err)
      setSubmitError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepProps = {
    totalSteps,
    currentStep,
    isSubmitting,
    onStepChange: setCurrentStep,
    onSubmit: () => void submit(),
  }

  // Rail state — a section is reached once its first step is at/before current.
  const activeSection = sectionForStep(currentStep, playerCount)
  const reached = RAIL_SECTIONS.reduce(
    (acc, { section }) => {
      acc[section] = firstStepOfSection(section, playerCount) <= currentStep
      return acc
    },
    {} as Record<Section, boolean>,
  )
  const goToSection = (section: Section) => {
    const target = firstStepOfSection(section, playerCount)
    if (target <= currentStep) setCurrentStep(target)
  }

  return (
    <FormShell
      activeSection={activeSection}
      reached={reached}
      onNavigate={goToSection}
    >
      <FormStep
        {...stepProps}
        stepOrder={1}
        stepName="報名選項"
        requiredOk={step1Ok}
      >
        <TextQuestion
          title="★隊伍名稱（上限20字）"
          value={groupName}
          onChange={setGroupName}
          validate={validateGroupName}
          invalidMessage="字數超過限制！請保持在 20 字以內"
        />
        <ChoiceQuestion
          title="★隊伍人數"
          options={PLAYER_COUNT_OPTIONS}
          value={playerCountChoice}
          onChange={setPlayerCountChoice}
        />
        <ChoiceQuestion
          title="★跨域組隊"
          description={
            '備註：符合以下任一條件，全隊報名費可減免 100 元\n(1) 報名隊伍內有三個（含）以上不同科系\n(2) 組內含高中職、大專院校生或碩博生、社會人士兩種（含）以上身份別之參賽者（限創客交流組）'
          }
          options={['是', '否']}
          value={isCrossDomain}
          onChange={setIsCrossDomain}
        />
        <SortableQuestion
          title="★組別或企業志願序"
          description={
            isMaker
              ? ''
              : '備註：\n(1) 企業題目或組別將依據隊伍的志願序分發。若單一企業或組別超額，將亂數抽籤決定。\n(2) 未報名創客交流組則將創客交流組的志願序填為 8。\n(3) 若未選擇，將隨機分配。'
          }
          value={priorityOrder}
          onChange={setPriorityOrder}
        />
      </FormStep>

      {currentStep >= 2 && currentStep <= playerCount + 1 && (
        <PlayerTabs
          playerCount={playerCount}
          activeIndex={currentStep - 2}
          onSelect={(i) => {
            const target = i + 2
            if (target <= currentStep) setCurrentStep(target)
          }}
        />
      )}

      {Array.from({ length: playerCount }, (_, index) => (
        <FormStep
          key={index}
          {...stepProps}
          stepOrder={index + 2}
          stepName={`基本資料 ( 參賽者${PLAYER_ORDER_LABELS[index]} )`}
          requiredOk={playerOk(players[index])}
        >
          <TextQuestion
            title="★姓名"
            value={players[index].name}
            onChange={(v) => updatePlayer(index, 'name', v)}
          />
          <ChoiceQuestion
            title="★生理性別"
            options={GENDER_OPTIONS}
            value={players[index].gender}
            onChange={(v) => updatePlayer(index, 'gender', v)}
          />
          <TextQuestion
            title="★生日（西元年月日 格式：20040101）"
            value={players[index].birthday}
            onChange={(v) => updatePlayer(index, 'birthday', v)}
            validate={validateBirthday}
            invalidMessage="請輸入有效的生日格式（8位數字，例如：20040101）"
          />
          <TextQuestion
            title="★身分證字號"
            value={players[index].idNumber}
            onChange={(v) => updatePlayer(index, 'idNumber', v)}
            validate={isValidId}
            invalidMessage="請輸入有效的身分證或居留證"
          />
          <ChoiceQuestion
            title="★身份"
            options={IDENTITY_OPTIONS}
            value={players[index].identity}
            onChange={(v) => updatePlayer(index, 'identity', v)}
          />
          <TextQuestion
            title="★就讀學校（填寫全名 e.g. 國立清華大學）"
            value={players[index].school}
            onChange={(v) => updatePlayer(index, 'school', v)}
          />
          <TextQuestion
            title="★科系（填寫全名 e.g. 資訊工程學系）"
            value={players[index].department}
            onChange={(v) => updatePlayer(index, 'department', v)}
          />
          <TextQuestion
            title="★年級（格式：XXX年級 e.g. 大學三年級、碩士二年級、已畢業）"
            value={players[index].grade}
            onChange={(v) => updatePlayer(index, 'grade', v)}
          />
          <TextQuestion
            title="★職業"
            value={players[index].occupation}
            onChange={(v) => updatePlayer(index, 'occupation', v)}
          />
          <TextQuestion
            title="★電子郵件信箱（格式：test@mail.com）"
            value={players[index].email}
            onChange={(v) => updatePlayer(index, 'email', v)}
            validate={validateEmail}
            invalidMessage="請輸入有效的電子郵件格式（例如：test@mail.com）"
          />
          <TextQuestion
            title="★手機號碼（十碼數字 格式：0921234567）"
            value={players[index].phone}
            onChange={(v) => updatePlayer(index, 'phone', v)}
            validate={validatePhoneNumber}
            invalidMessage="請輸入有效的台灣手機號碼格式（09開頭，總共10碼數字）"
          />
          <TextQuestion
            title="★特殊飲食習慣"
            value={players[index].dietaryRestrictions}
            onChange={(v) => updatePlayer(index, 'dietaryRestrictions', v)}
          />
          <ChoiceQuestion
            title="★衣服尺寸"
            options={SHIRT_SIZE_OPTIONS}
            value={players[index].shirtSize}
            onChange={(v) => updatePlayer(index, 'shirtSize', v)}
          />
        </FormStep>
      ))}

      <FormStep
        {...stepProps}
        stepOrder={totalSteps - 1}
        stepName="填寫同意書"
        requiredOk={assentOk}
      >
        <ChoiceQuestion
          title="★個人資料搜集、處理及利用之告知暨同意書"
          description={`${CONSENT_PLACEHOLDER}\n\n★我已詳細閱讀，並同意以上內容`}
          options={['是']}
          value={assentFirst}
          onChange={setAssentFirst}
        />
        <ChoiceQuestion
          title="★智慧財產權聲明暨授權同意書"
          description={`${CONSENT_PLACEHOLDER}\n\n★我已詳細閱讀，並同意以上內容`}
          options={['是']}
          value={assentSecond}
          onChange={setAssentSecond}
        />
      </FormStep>

      <FormStep
        {...stepProps}
        stepOrder={totalSteps}
        stepName="其他"
        requiredOk={otherOk}
      >
        <FileUpload
          title="清寒證明"
          accept={['pdf', 'png', 'jpg', 'jpeg']}
          value={lowIncomeProof}
          onChange={setLowIncomeProof}
        />
        <ChoiceQuestion
          title="★是否全程參與工作坊"
          options={['是', '否']}
          value={workshopAttendance}
          onChange={setWorkshopAttendance}
        />
        <ChoiceQuestion
          title="★是否全程參與開幕、閉幕"
          options={['是', '否']}
          value={ceremonyAttendance}
          onChange={setCeremonyAttendance}
        />
      </FormStep>

      {submitError && (
        <div className="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 p-4 text-center">
          <p className="text-red-300">
            報名失敗，請再試一次，或直接用 email 聯絡我們：
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold underline">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      )}
    </FormShell>
  )
}
