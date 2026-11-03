# Korean-Adhd

[한국어](README.md) | **한국어 회사어투** | [English](README.en.md)

Claude Code 한국어 답변을 바로 행동 가능한 형태로 변경. 번역투와 AI 상투구 제거.

[i-have-adhd](https://github.com/ayghri/i-have-adhd) 답변 규칙과 [im-not-ai](https://github.com/epoko77-ai/im-not-ai) 한국어 문체 규칙 통합.

[README.md](README.md) 내용을 회사 보고체로 작성한 문서. 답변 예시 인용은 원문 유지.

- **회사어투 옵션**: 답변을 "DB 확인 후 수정 완료" 같은 보고체로 축약. 업무 보고 기준으로 상태 구분, 추측 미기재. [자세히 보기](#회사어투-옵션)
- **원작 대비 개선점**: 답변 모양과 한국어 문장 동시 적용. 두 규칙 충돌 시 기준 명시. [자세히 보기](#원작-대비-개선점)

## 설치

- 소요 시간: 약 2분
- 필요 항목: Claude Code, Node.js
- Node.js 없을 경우: 세션 시작마다 훅 오류 기록, 세션은 계속 진행됨

1. Claude Code 세션 안에서 플러그인 설치.

   ```
   /plugin marketplace add evelynn/Korean-Adhd
   /plugin install korean-adhd@korean-adhd
   ```

2. 새 세션 시작(`/exit` 후 `claude`) 후 규칙 활성화.

   ```
   /korean-adhd:korean-adhd
   ```

3. 아무 질문이나 입력. 첫 줄이 할 일이고 끝 줄이 `다음:`으로 시작하면 정상 적용.

새 세션마다 자동 활성화 필요 시 터미널에서 플래그 파일 생성. 다음 새 세션부터 적용.

```bash
# macOS, Linux, Git Bash
touch ~/.claude/.korean-adhd-always
```

```powershell
# PowerShell
New-Item -ItemType File "$HOME\.claude\.korean-adhd-always"
```

i-have-adhd 사용 중이면 터미널에서 `claude plugin disable i-have-adhd@i-have-adhd` 실행 권장.

사유: 함께 켜도 Claude는 이 플러그인 규칙을 따르지만 비슷한 규칙이 두 번 주입됨.

## 회사어투 옵션

답변을 회사 보고서 보고체로 축약.

- 적용 범위: 채팅 답변, 업무 보고서
- 기본값: 꺼짐
- 규칙 파일: [`references/company-tone.md`](skills/korean-adhd/references/company-tone.md)

켜는 방법 2가지.

1. 현재 세션만 적용: `/korean-adhd:korean-adhd`로 규칙 활성화 후 "회사어투 켜" 입력. 해제는 "회사어투 꺼" 입력.
2. 새 세션마다 적용: 플래그 파일 생성. `.korean-adhd-always` 파일 함께 필요.

   ```bash
   # macOS, Linux, Git Bash
   touch ~/.claude/.korean-adhd-company
   ```

   ```powershell
   # PowerShell
   New-Item -ItemType File "$HOME\.claude\.korean-adhd-company"
   ```

### 달라지는 문장

| 기본 | 회사어투 |
| --- | --- |
| DB를 확인하고 고쳤습니다. | DB 확인 후 수정 완료 |
| 원인은 캐시입니다. | 원인: 캐시 |
| 서버를 재시작해야 합니다. | 서버 재시작 필요 |
| 내일 배포합니다. | 내일 배포 예정 |
| 캐시가 원인일 수 있습니다. | 캐시 원인 가능성 있음(확인 필요) |
| 다음: 처음 실패한 줄을 붙여 주세요. | 다음: 처음 실패한 줄 전달 요청 |

### 함께 적용되는 규칙

| 규칙 | 내용 |
| --- | --- |
| 문장 끝 | "~함", "~완료", "~필요", "~예정", "~요청" 사용, "~입니다", "~합니다", "~해요" 미사용 |
| 비교 | 항목별 비교는 표로 정리 |
| 한 줄 | 한 줄에 사실 하나, 이유는 "사유:" 줄로 분리 |
| 상태 | 적용 완료, 진행 중, 검토 중 구분 |
| 추측 | 확인되지 않은 내용은 "미확인" 또는 "확인 필요"로 표기, 검증하지 않은 일은 "완료" 표기 금지 |
| 제외 | 메일, 공지, README, 사용자가 쓴 글의 윤문은 원래 격식 유지, 영어 답변은 미적용 |

"제외" 항목은 답변 작성 시 규칙 기준. 이 문서는 보고체 README 요청에 따른 별도 작성본.

### 보고 예시

규칙 설명용으로 직접 작성한 글.

기본:

> 로그인 오류를 확인했습니다. 원인은 캐시로 보이지만 아직 확실하지 않습니다. 테스트 3건이 실패했고 내일 배포할 예정입니다.

회사어투:

> 로그인 오류 확인 완료
>
> 원인: 캐시 가능성 있음(확인 필요)
>
> 테스트 3건 실패
>
> 내일 배포 예정
>
> 다음: 실패 로그 첫 줄 전달 요청

### 실제 답변

요청: 로그인 API가 401을 반환해. 어디부터 봐야 해?

> curl로 응답 헤더와 본문부터 확인.
>
> (명령과 원인 표 생략)
>
> 사유: 401 원인이 본문(`error`, `message`)이나 `WWW-Authenticate` 헤더에 적혀 있는 경우가 많음.
>
> 현재 작업 폴더가 비어 있어 코드 직접 확인 불가. 프레임워크 정보 없이 일반 순서로만 안내함.
>
> 다음: curl 결과의 상태줄과 응답 본문, 사용 중인 프레임워크명 전달 요청.

- 실행 조건: 2026-11-03, Claude Code 2.1.317, Sonnet, 1회 실행
- 환경: 작성자 전역 설정 함께 적용
- 다른 환경에서는 결과 달라질 가능성 있음

## 원작 대비 개선점

원작과 다른 점 4가지.

1. **문장까지 교정.** i-have-adhd는 답변 구조 지정, 규칙 문서는 영어, 한국어 문체 규칙 없음. 한국어 문장 규칙 추가.
2. **작성 시점에 적용.** im-not-ai는 완성된 글을 탐지·윤문. 이 플러그인은 답변 작성 시 규칙 적용, 별도 호출 불필요.
3. **충돌 기준 명시.** i-have-adhd는 번호 목록 요구, im-not-ai는 불릿 남용을 AI 티로 판단. 실행 단계와 선택지는 목록, 이유와 원리는 문장으로 작성하도록 지정.
4. **회사 보고체 선택 가능.** 업무 보고용 어미와 상태 구분 규칙을 옵션으로 제공.

| 항목 | i-have-adhd | im-not-ai | Korean-Adhd |
| --- | --- | --- | --- |
| 주된 목적 | 답변 모양 | 이미 쓴 한글 글 윤문 | 답변 모양과 한국어 문장 동시 적용 |
| 적용 시점 | 켜 두면 매 답변 | 윤문 요청 시 | 켜 두면 매 답변, 긴 글은 상세 규칙 추가 |
| 규칙 문서 언어 | 영어 | 한국어 | 한국어 |
| 두 규칙의 충돌 처리 | 해당 없음 | 해당 없음 | `SKILL.md` 3장에 기준 명시 |
| 회사 보고체 | 없음 | 없음 | 옵션 제공 |

im-not-ai의 다단계 윤문 파이프라인과 Python 게이트는 미포함. 긴 글 정밀 윤문은 im-not-ai 직접 설치 권장.

## 앞으로 개선할 점

1. **답변 품질 평가 세트.** 현재 테스트는 답변의 규칙 준수 여부 미검사. `claude plugin eval`로 평가 세트 작성 예정.
2. **모델별 차이 측정.** 2026-11-03 실행에서 Sonnet은 회사어투와 `다음:` 줄 준수. Haiku는 "한 줄로" 답하라는 요청에서 둘 다 미준수. 각 1회 결과라 표본 확대 필요.
3. **Node.js 없는 환경.** 항상 켜기 훅은 Node.js로만 동작. 원작 셸 구현 파일을 참고해 셸 훅 병행 여부 검토 예정.
4. **macOS와 Linux 시험.** 현재까지 Windows 11에서만 실행함.
5. **회사어투 단독 켜기.** 회사어투 파일은 항상 켜기 파일이 있어야 동작. 회사어투 파일만으로 켜는 방식 검토 예정.

## 적용 예시

아래 예시는 규칙 설명용으로 직접 작성한 글. 회사어투를 끈 기본 말투 기준. 실제 답변은 모델과 대화 내용에 따라 달라짐.

### 예시 1. 오류를 고칠 때

요청: 로그인하면 401이 나와. 어떻게 고쳐?

이전:

> 네, 확인해 보겠습니다. 인증 흐름에는 여러 요소가 있어서 먼저 구조를 살펴보면 미들웨어와 토큰 검증, 쿠키 처리가 관련되어 있습니다. 결론적으로 토큰 검증 부분을 수정해 볼 수 있을 것 같습니다. 참고로 의존성 버전도 낡았습니다. 도움이 되셨길 바랍니다!

이후:

> `src/auth.ts:42`의 `verifyToken`을 고치세요. 요청의 `Authorization` 헤더를 읽지 않습니다.
>
> 1. 42번째 줄에서 헤더를 읽도록 바꿉니다.
> 2. `npm test -- auth.spec.ts`를 실행합니다.
>
> 다음: 테스트가 실패하면 처음 실패한 줄을 붙여 주세요.

첫 줄을 할 일로 변경. 의존성 이야기는 현재 문제 종료 후 별도 확인.

### 예시 2. 작업이 길어질 때

요청: API 문서 5개를 한국어로 옮겨 줘.

이전:

> 번역 작업을 진행하고 있습니다. 조금만 기다려 주시면 곧 완료될 예정입니다.

이후:

> 3/5단계 완료: 인증 문서를 옮겼습니다. 남은 시간은 약 5분입니다.
>
> 다음: 결제 문서를 옮깁니다.

진행 위치를 매번 재표기. 시간은 숫자로 표기.

### 예시 3. 되돌리기 어려운 작업

요청: 오래된 브랜치 다 지워 줘.

이후:

> 지우기 전에 확인이 필요합니다. 대상은 12개이고 그중 `feature/payment`와 `fix/login`은 병합되지 않았습니다. 지우면 이 두 브랜치의 커밋을 찾기 어렵습니다.
>
> 다음: 병합된 10개만 지울지 12개 모두 지울지 알려 주세요.

삭제, 강제 push, 스키마 변경은 사전 확인 필수.

### 예시 4. 문장 바꾸기

| 이전 | 이후 |
| --- | --- |
| 배포에 있어서 중요한 점은 환경 변수입니다. | 배포에서 중요한 건 환경 변수입니다. |
| 스크립트에 의해 생성된 파일을 통해 검증을 진행합니다. | 스크립트가 만든 파일로 검증합니다. |
| 강한 성능을 가지고 있습니다. | 성능이 좋습니다. |
| 결론적으로, 캐시가 원인이라는 것입니다. | 원인은 캐시입니다. |

## 켜기와 끄기

| 하려는 일 | 방법 |
| --- | --- |
| 이 세션에서만 켜기 | `/korean-adhd:korean-adhd` 입력 |
| 이 세션에서 끄기 | "ADHD 모드 꺼", "normal mode", "stop adhd mode" 중 하나 입력 |
| 새 세션마다 켜기 | `~/.claude/.korean-adhd-always` 파일 생성 |
| 새 세션마다 켜기 해제 | 위 파일 삭제 |
| 이 세션에서 회사어투 켜기·끄기 | 규칙 활성화 후 "회사어투 켜", "회사어투 꺼" 입력 |
| 새 세션마다 회사어투 켜기 | `~/.claude/.korean-adhd-company` 파일 생성 |
| 새 세션마다 회사어투 켜기 해제 | 위 파일 삭제 |

회사어투 파일은 `.korean-adhd-always` 파일 함께 필요.

항상 켜기 파일이 있으면 세션 중 해제해도 대화 압축이나 `/clear` 후 규칙 재주입됨.

## 들어 있는 규칙

전체 규칙: [`skills/korean-adhd/SKILL.md`](skills/korean-adhd/SKILL.md)

| 구분 | 내용 |
| --- | --- |
| 답변 모양 | 첫 줄은 행동, 단계에 번호, 끝 줄은 `다음:`, 곁가지는 뒤로, 현재 위치 다시 말하기, 시간은 숫자로, 목록은 5개까지 |
| 한국어 문장 | 번역투와 상투구 제거, 비유 제거, 연결어미 뒤 쉼표 제거, 강조용 굵은 글씨 제거, 말투 통일 |
| 그대로 두는 것 | 코드, 명령, 경로, 오류 원문, 수치, 날짜, 고유명사, 직접 인용, 불확실하다는 표현 |
| 규칙보다 우선하는 경우 | "설명해 줘" 요청, 되돌리기 어려운 작업, 세 번 연속 실패, 정말 모호한 요청, 규칙을 지키면 답이 없어지는 경우, 시스템 프롬프트와 하네스 규칙 |
| 긴 글과 윤문 | 문서, 메일, 보고서 작성 시 [`references/korean-rules.md`](skills/korean-adhd/references/korean-rules.md) 참조 |

사용자가 영어로 작성하면 영어로 답변, 답변 모양 규칙만 적용.

## 문제 해결

| 증상 | 확인할 것 |
| --- | --- |
| `/korean-adhd` 미동작 | 전체 이름 `/korean-adhd:korean-adhd`로 입력 |
| 새 세션에서 자동 활성화 안 됨 | `.korean-adhd-always` 파일 위치와 `node --version` 실행 여부 확인. `CLAUDE_CONFIG_DIR` 사용 시 파일을 해당 폴더에 배치 |
| 회사어투 미적용 | `.korean-adhd-always` 파일 존재 여부 확인 |
| 새 버전 규칙 미반영 | 아래 업데이트 명령 실행 후 새 세션 시작 |
| 규칙 간헐적 미준수 | 규칙은 모델 대상 지시라 모델과 요청에 따라 준수 정도 다름. "한 줄로 답해" 같은 요청이 있으면 해당 요청을 따르는 경우 있음 |

## 업데이트와 제거

**업데이트** (터미널)

```bash
claude plugin marketplace update korean-adhd
claude plugin update korean-adhd@korean-adhd
```

**제거** (터미널)

```bash
claude plugin uninstall korean-adhd@korean-adhd
claude plugin marketplace remove korean-adhd
```

**플래그 파일 삭제** (터미널)

```bash
# macOS, Linux, Git Bash
rm -f ~/.claude/.korean-adhd-always ~/.claude/.korean-adhd-company
```

```powershell
# PowerShell
Remove-Item "$HOME\.claude\.korean-adhd-always","$HOME\.claude\.korean-adhd-company" -ErrorAction SilentlyContinue
```

## 구성과 테스트

| 경로 | 내용 |
| --- | --- |
| `skills/korean-adhd/SKILL.md` | 세션에 넣는 규칙 전문 |
| `skills/korean-adhd/references/korean-rules.md` | 긴 글과 윤문에 쓰는 상세 규칙 |
| `skills/korean-adhd/references/company-tone.md` | 회사어투 옵션 규칙 |
| `hooks/` | 플래그가 있을 때 규칙을 넣는 SessionStart 훅 |
| `tests/run.mjs` | git 외 의존성 없는 테스트 |

- 훅 출력 한도: Claude Code가 10,000자까지 그대로 주입, 초과 시 앞 2,000자 미리보기로 대체
- 대응: 테스트에서 주입량 검사
- 실제 설치본 주입량: 기본 약 5,100~5,500자, 회사어투 포함 약 6,200~6,700자(설치 경로 길이에 따라 다름)
- 항상 켜기 사용 시 이 분량이 세션마다 컨텍스트에 포함됨

```bash
node tests/run.mjs
claude plugin validate .
```

규칙 수정 시 `.claude-plugin/plugin.json`의 `version` 상향 필요.

사유: 상향해야 사용자에게 업데이트 전달됨.

## 참조

[i-have-adhd](https://github.com/ayghri/i-have-adhd), [im-not-ai](https://github.com/epoko77-ai/im-not-ai) 참조.

## 라이선스

MIT. 두 원작 저작권 표시는 [`LICENSE`](LICENSE)에 함께 수록.
