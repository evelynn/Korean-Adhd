# Korean-Adhd

Claude Code의 한국어 답변을 ADHD 독자가 바로 행동할 수 있는 모양으로 바꾸고, 번역투와 AI 상투구를 걷어냅니다.

[i-have-adhd](https://github.com/ayghri/i-have-adhd)의 답변 규칙과 [im-not-ai](https://github.com/epoko77-ai/im-not-ai)의 한국어 문체 규칙을 하나로 합쳤습니다. 플러그인 ID는 `korean-adhd`입니다.

## 설치

Claude Code에서 차례로 입력합니다.

```
/plugin marketplace add evelynn/Korean-Adhd
/plugin install korean-adhd@korean-adhd
```

새 세션에서 `/korean-adhd:korean-adhd`를 입력하면 그 세션에 켜집니다. 끌 때는 "ADHD 모드 꺼"라고 말합니다.

## 항상 켜기

플래그 파일을 만들면 새 세션마다 자동으로 켜집니다. 파일을 지우면 꺼집니다.

```bash
# macOS, Linux, Git Bash
touch ~/.claude/.korean-adhd-always
```

```powershell
# PowerShell
New-Item -ItemType File "$HOME\.claude\.korean-adhd-always"
```

i-have-adhd를 쓰고 있다면 옮긴 뒤 끄기를 권장합니다. 함께 켜도 이 플러그인의 규칙을 따르지만 비슷한 규칙이 두 번 주입됩니다.

## 회사어투 옵션

답변을 회사 보고서의 보고체로 줄입니다. 문장 끝은 "~함", "~완료", "~적용", "~확인 필요"로 쓰고 "~입니다", "~습니다", "~한다", "~할 수 있습니다"는 쓰지 않습니다. 비교는 표로 정리하고 적용 완료, 진행 중, 검토 중을 구분합니다. 기본값은 꺼짐입니다.

| 기본 | 회사어투 |
| --- | --- |
| DB를 확인하고 고쳤습니다. | DB 확인 후 수정 완료 |
| 서버를 재시작해야 합니다. | 서버 재시작 필요 |
| 다음: 처음 실패한 줄을 붙여 주세요. | 다음: 처음 실패한 줄 전달 요청 |

그 세션에서만 쓰려면 "회사어투 켜"라고 말합니다. 끌 때는 "회사어투 꺼"라고 말합니다.

새 세션마다 자동으로 켜려면 플래그 파일을 만듭니다. 위의 항상 켜기 플래그가 함께 있어야 동작합니다. 파일을 지우면 꺼집니다.

```bash
# macOS, Linux, Git Bash
touch ~/.claude/.korean-adhd-company
```

```powershell
# PowerShell
New-Item -ItemType File "$HOME\.claude\.korean-adhd-company"
```

메일, 공지, README, 사용자가 쓴 글의 윤문은 원래 격식을 유지합니다.

## 달라지는 점

| 이전 | 이후 |
| --- | --- |
| 네, 확인해 보겠습니다. 배포에 있어서 중요한 점은 환경 변수입니다. | `.env`의 `DB_URL`을 고치세요. 배포가 실패한 원인입니다. |
| 스크립트에 의해 생성된 파일을 통해 검증을 진행합니다. | 스크립트가 만든 파일로 검증합니다. |
| 결론적으로, 캐시가 원인이라는 것입니다. | 원인은 캐시입니다. |

## 구성

- `skills/korean-adhd/SKILL.md`: 매 세션 주입되는 규칙입니다. 훅 주입 한도인 10,000자 안에 들어가도록 관리합니다.
- `skills/korean-adhd/references/korean-rules.md`: 문서를 쓰거나 글을 다듬을 때만 읽는 상세 규칙입니다.
- `skills/korean-adhd/references/company-tone.md`: 회사어투 옵션 규칙입니다. 옵션을 켤 때만 적용합니다.
- `hooks/`: 플래그가 있을 때 규칙을 주입하는 SessionStart 훅입니다. 실행하려면 Node.js가 필요합니다.
- `tests/run.mjs`: 의존성 없는 테스트입니다. `node tests/run.mjs`로 실행합니다.

## 두 원작을 합친 방식

두 규칙은 일부 부딪힙니다. i-have-adhd는 번호 목록을 요구합니다. im-not-ai는 불릿 남용을 AI 티로 봅니다. 그래서 실행 단계와 선택지는 목록으로 쓰고 이유와 원리는 문장으로 잇도록 정했습니다. 나머지 충돌의 처리 기준은 `SKILL.md` 3장에 있습니다.

im-not-ai의 다단계 윤문 파이프라인과 Python 게이트는 포함하지 않았습니다. 이 플러그인은 답변을 쓰는 순간에 적용하는 규칙입니다. 긴 글을 정밀하게 윤문하려면 im-not-ai를 직접 설치하는 편이 낫습니다.

## 라이선스

MIT. 두 원작의 저작권 표시는 `LICENSE`에 함께 실었습니다.
