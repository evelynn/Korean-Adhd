# Korean-Adhd

**한국어 회사어투** | [한국어 기본어투](README.default.md) | [English](README.en.md)

Claude Code 한국어 답변을 바로 행동 가능한 형태로 변경. 번역투와 AI 특유의 표현 제거.

[i-have-adhd](https://github.com/ayghri/i-have-adhd) 답변 규칙, [im-not-ai](https://github.com/epoko77-ai/im-not-ai) 한국어 문체 규칙, [K-Humanizer](https://github.com/evergreentree97/K-Humanizer) 윤문·번역 판단 기준 통합.

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

3. 오류 해결 방법 질문. 첫 줄이 할 일이면 정상 적용.

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

## 적용 예시

아래 예시는 규칙 설명용으로 직접 작성한 글. 회사어투 적용 기준. 실제 답변은 모델과 대화 내용에 따라 달라짐.

### 예시 1. 오류를 고칠 때

요청: 로그인하면 401이 나와. 어떻게 고쳐?

이전:

> 네, 확인해 보겠습니다. 인증 흐름에는 여러 요소가 있어서 먼저 구조를 살펴보면 미들웨어와 토큰 검증, 쿠키 처리가 관련되어 있습니다. 결론적으로 토큰 검증 부분을 수정해 볼 수 있을 것 같습니다. 참고로 의존성 버전도 낡았습니다. 도움이 되셨길 바랍니다!

이후:

> `src/auth.ts:42`의 `verifyToken` 수정 필요.
>
> 사유: 요청의 `Authorization` 헤더를 읽지 않음.
>
> 1. 42번째 줄에서 헤더 읽도록 수정.
> 2. `npm test -- auth.spec.ts` 실행.
>
> 다음: 테스트 실패 시 처음 실패한 줄 전달 요청.

첫 줄을 할 일로 변경. 의존성 이야기는 현재 문제 종료 후 별도 확인.

### 예시 2. 작업이 길어질 때

요청: API 문서 5개를 한국어로 옮겨 줘.

이전:

> 번역 작업을 진행하고 있습니다. 조금만 기다려 주시면 곧 완료될 예정입니다.

이후:

> 3/5단계 완료: 인증 문서 번역. 남은 시간 약 5분.
>
> 다음: 결제 문서 번역 예정.

진행 위치를 매번 재표기. 시간은 숫자로 표기.

### 예시 3. 되돌리기 어려운 작업

요청: 오래된 브랜치 다 지워 줘.

이후:

> 삭제 전 확인 필요.
>
> 대상: 12개. `feature/payment`, `fix/login` 미병합.
>
> 삭제 시 두 브랜치 커밋 찾기 어려움.
>
> 다음: 병합된 10개만 삭제·12개 전체 삭제 중 선택 요청.

삭제, 강제 push, 스키마 변경은 사전 확인 필수.

### 예시 4. 문장 바꾸기

| 이전 | 이후 |
| --- | --- |
| 배포에 있어서 중요한 점은 환경 변수입니다. | 배포 시 중요 항목: 환경 변수 |
| 스크립트에 의해 생성된 파일을 통해 검증을 진행합니다. | 스크립트 생성 파일로 검증 |
| 강한 성능을 가지고 있습니다. | 성능 좋음 |
| 결론적으로, 캐시가 원인이라는 것입니다. | 원인: 캐시 |

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

## 라이선스

MIT. 세 원작 저작권 표시는 [`LICENSE`](LICENSE)에 함께 수록.
