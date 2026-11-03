# Korean-Adhd

[한국어](README.md) | [한국어 회사어투](README.company.md) | **English**

A Claude Code plugin that makes Korean replies immediately actionable and strips out translated-sounding phrasing and AI clichés.

It combines the reply rules of [i-have-adhd](https://github.com/ayghri/i-have-adhd) with the Korean writing rules of [im-not-ai](https://github.com/epoko77-ai/im-not-ai).

- **Company tone option**: shortens replies to Korean business-report style, such as "DB 확인 후 수정 완료" (DB checked and fixed). It separates work states and rules out guessing. [Details](#company-tone-option)
- **Improvements over the originals**: handles reply shape and Korean sentences together, and sets a rule for when the two rule sets conflict. [Details](#improvements-over-the-originals)

The rules are written for Korean readers. If you write to Claude in English, it replies in English and applies only the reply-shape rules.

## Install

Takes about 2 minutes. You need Claude Code and Node.js. Without Node.js, a hook error is logged at each session start, but the session continues.

1. Install the plugin inside a Claude Code session.

   ```
   /plugin marketplace add evelynn/Korean-Adhd
   /plugin install korean-adhd@korean-adhd
   ```

2. Open a new session (`/exit`, then `claude`) and turn the rules on.

   ```
   /korean-adhd:korean-adhd
   ```

3. Ask anything. It is on if the first line is the action to take and the last line starts with `다음:` (Next:).

To turn it on automatically in every new session, create a flag file in your terminal. It applies from the next new session.

```bash
# macOS, Linux, Git Bash
touch ~/.claude/.korean-adhd-always
```

```powershell
# PowerShell
New-Item -ItemType File "$HOME\.claude\.korean-adhd-always"
```

If you were using i-have-adhd, turn it off in your terminal with `claude plugin disable i-have-adhd@i-have-adhd`. With both on, Claude still follows this plugin's rules, but similar rules get injected twice.

## Company tone option

Shortens replies to Korean business-report style. It applies to chat replies and work reports and is off by default. The rules are in [`references/company-tone.md`](skills/korean-adhd/references/company-tone.md).

There are two ways to turn it on.

1. For the current session only, turn the rules on with `/korean-adhd:korean-adhd`, then say "회사어투 켜". Say "회사어투 꺼" to turn it off.
2. For every new session, create a flag file. It only works together with the `.korean-adhd-always` file.

   ```bash
   # macOS, Linux, Git Bash
   touch ~/.claude/.korean-adhd-company
   ```

   ```powershell
   # PowerShell
   New-Item -ItemType File "$HOME\.claude\.korean-adhd-company"
   ```

### How sentences change

| Default | Company tone | Meaning |
| --- | --- | --- |
| DB를 확인하고 고쳤습니다. | DB 확인 후 수정 완료 | DB checked and fixed |
| 원인은 캐시입니다. | 원인: 캐시 | Cause: cache |
| 서버를 재시작해야 합니다. | 서버 재시작 필요 | Server restart needed |
| 내일 배포합니다. | 내일 배포 예정 | Deploying tomorrow |
| 캐시가 원인일 수 있습니다. | 캐시 원인 가능성 있음(확인 필요) | Cache may be the cause (needs checking) |
| 다음: 처음 실패한 줄을 붙여 주세요. | 다음: 처음 실패한 줄 전달 요청 | Next: send the first failing line |

### Rules applied with it

| Rule | Content |
| --- | --- |
| Sentence endings | Uses report endings such as "~함", "~완료", "~필요", "~예정", "~요청". Avoids "~입니다", "~합니다", "~해요" |
| Comparisons | Item-by-item comparisons go in a table |
| One line | One fact per line, with reasons on a separate "사유:" (reason) line |
| Status | Separates applied, in progress and under review |
| Guessing | Marks unconfirmed content as "미확인" (unconfirmed) or "확인 필요" (needs checking). Never writes "완료" (done) for unverified work |
| Exclusions | Email, announcements, READMEs and edits of the user's own writing keep their original formality. English replies are not affected |

### Report example

Written by hand to illustrate the rules.

Default:

> 로그인 오류를 확인했습니다. 원인은 캐시로 보이지만 아직 확실하지 않습니다. 테스트 3건이 실패했고 내일 배포할 예정입니다.
>
> (I checked the login error. The cause looks like the cache, but that is not certain yet. Three tests failed and we plan to deploy tomorrow.)

Company tone:

> 로그인 오류 확인 완료 (login error checked)
>
> 원인: 캐시 가능성 있음(확인 필요) (cause: possibly cache, needs checking)
>
> 테스트 3건 실패 (3 tests failed)
>
> 내일 배포 예정 (deploying tomorrow)
>
> 다음: 실패 로그 첫 줄 전달 요청 (next: send the first line of the failure log)

### A real reply

Request: 로그인 API가 401을 반환해. 어디부터 봐야 해? (The login API returns 401. Where should I start?)

> curl로 응답 헤더와 본문부터 확인.
>
> (command and cause table omitted)
>
> 사유: 401 원인이 본문(`error`, `message`)이나 `WWW-Authenticate` 헤더에 적혀 있는 경우가 많음.
>
> 현재 작업 폴더가 비어 있어 코드 직접 확인 불가. 프레임워크 정보 없이 일반 순서로만 안내함.
>
> 다음: curl 결과의 상태줄과 응답 본문, 사용 중인 프레임워크명 전달 요청.

This is one run on 2026-11-03 with Claude Code 2.1.317 and Sonnet. The author's global settings were also active, so results may differ elsewhere.

## Improvements over the originals

Four things differ from the originals.

1. **It fixes the sentences too.** i-have-adhd shapes the reply, but its rules are in English and contain no Korean writing rules. This plugin adds them.
2. **It applies while writing.** im-not-ai detects and edits finished text. This plugin applies its rules as the reply is written, so no separate call is needed.
3. **It sets a rule for conflicts.** i-have-adhd asks for numbered lists, while im-not-ai treats overuse of bullets as a sign of AI writing. Here, action steps and options are lists, and reasons and principles stay in prose.
4. **It offers a business-report tone.** Report endings and status rules for work reporting are available as an option.

| Item | i-have-adhd | im-not-ai | Korean-Adhd |
| --- | --- | --- | --- |
| Main purpose | Reply shape | Editing finished Korean text | Reply shape and Korean sentences together |
| When it applies | Every reply when on | When you ask for an edit | Every reply when on, with detailed rules for long text |
| Rule language | English | Korean | Korean |
| Conflict handling between the two rule sets | Not applicable | Not applicable | Defined in chapter 3 of `SKILL.md` |
| Business-report tone | None | None | Optional |

The multi-step editing pipeline and Python gate from im-not-ai are not included. For precise editing of long text, install im-not-ai directly.

## Planned improvements

1. **Reply quality evals.** Current tests do not check whether replies follow the rules. The plan is to build an eval set with `claude plugin eval`.
2. **Measuring differences between models.** In runs on 2026-11-03, Sonnet followed the company tone and the `다음:` line. Haiku followed neither when asked to answer in one line. Each result is a single run, so the sample needs to grow.
3. **Environments without Node.js.** The always-on hook only runs on Node.js. Adding shell hooks based on the shell implementation files in i-have-adhd is under review.
4. **macOS and Linux testing.** So far it has only been run on Windows 11.
5. **Company tone on its own.** The company tone file only works with the always-on file. Turning it on with just its own file is under review.

## Examples

These examples are written by hand to illustrate the rules and are shown in English for readability. Actual replies are in Korean and vary with the model and conversation.

### Example 1. Fixing an error

Request: I get a 401 when I log in. How do I fix it?

Before:

> Sure, let me take a look. The auth flow has several parts, so looking at the structure first, the middleware, token verification and cookie handling are all involved. In conclusion, it might be possible to modify the token verification part. By the way, your dependencies are also out of date. Hope this helps!

After:

> Fix `verifyToken` at `src/auth.ts:42`. It does not read the request's `Authorization` header.
>
> 1. Change line 42 to read the header.
> 2. Run `npm test -- auth.spec.ts`.
>
> Next: if a test fails, paste the first failing line.

The first line is now the action. The dependency topic waits until the current problem is done.

### Example 2. Long-running work

Request: Translate these 5 API documents into Korean.

Before:

> The translation is in progress. Please wait a moment and it will be finished soon.

After:

> Step 3/5 done: auth document translated. About 5 minutes left.
>
> Next: translate the payment document.

It restates progress every time and gives time as a number.

### Example 3. Hard-to-reverse work

Request: Delete all the old branches.

After:

> Confirmation needed before deleting. There are 12 branches, and `feature/payment` and `fix/login` are not merged. Deleting them makes their commits hard to find.
>
> Next: tell me whether to delete only the 10 merged ones or all 12.

Deletes, force pushes and schema changes get a confirmation first.

### Example 4. Rewriting sentences

| Before | After | Meaning |
| --- | --- | --- |
| 배포에 있어서 중요한 점은 환경 변수입니다. | 배포에서 중요한 건 환경 변수입니다. | What matters in deployment is the environment variables. |
| 스크립트에 의해 생성된 파일을 통해 검증을 진행합니다. | 스크립트가 만든 파일로 검증합니다. | We verify with the file the script made. |
| 강한 성능을 가지고 있습니다. | 성능이 좋습니다. | It performs well. |
| 결론적으로, 캐시가 원인이라는 것입니다. | 원인은 캐시입니다. | The cause is the cache. |

## Turning it on and off

| Goal | How |
| --- | --- |
| Turn on for this session | Type `/korean-adhd:korean-adhd` |
| Turn off for this session | Say "ADHD 모드 꺼", "normal mode" or "stop adhd mode" |
| Turn on for every new session | Create `~/.claude/.korean-adhd-always` |
| Stop turning on for new sessions | Delete that file |
| Company tone on or off for this session | With the rules on, say "회사어투 켜" or "회사어투 꺼" |
| Company tone for every new session | Create `~/.claude/.korean-adhd-company` |
| Stop company tone for new sessions | Delete that file |

The company tone file only works together with the `.korean-adhd-always` file. With the always-on file present, the rules are injected again after compaction or `/clear`, even if you turned them off during the session.

## Rules included

The full rules are in [`skills/korean-adhd/SKILL.md`](skills/korean-adhd/SKILL.md).

| Area | Content |
| --- | --- |
| Reply shape | Action on the first line, numbered steps, `다음:` on the last line, tangents later, restate current position, time as numbers, lists up to 5 items |
| Korean sentences | Removes translated-sounding phrasing and clichés, metaphors, commas after connective endings and emphasis bolding. Keeps one speech level |
| Left untouched | Code, commands, paths, original error text, numbers, dates, proper nouns, direct quotes and statements of uncertainty |
| When rules give way | "Explain this" requests, hard-to-reverse work, three failures in a row, truly ambiguous requests, cases where following a rule would remove the answer, and system prompt and harness rules |
| Long text and editing | Reads [`references/korean-rules.md`](skills/korean-adhd/references/korean-rules.md) when writing documents, email or reports |

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| `/korean-adhd` does not work. | Type the full name, `/korean-adhd:korean-adhd`. |
| It does not turn on automatically in new sessions. | Check the location of the `.korean-adhd-always` file and that `node --version` runs. If you use `CLAUDE_CONFIG_DIR`, put the file in that folder. |
| Company tone is not applied. | Check that the `.korean-adhd-always` file also exists. |
| New rules do not take effect. | Run the update commands below and open a new session. |
| Rules are sometimes not followed. | Rules are instructions to the model, so adherence varies with the model and request. A request like "answer in one line" may take priority. |

## Update and uninstall

**Update** (terminal)

```bash
claude plugin marketplace update korean-adhd
claude plugin update korean-adhd@korean-adhd
```

**Uninstall** (terminal)

```bash
claude plugin uninstall korean-adhd@korean-adhd
claude plugin marketplace remove korean-adhd
```

**Delete flag files** (terminal)

```bash
# macOS, Linux, Git Bash
rm -f ~/.claude/.korean-adhd-always ~/.claude/.korean-adhd-company
```

```powershell
# PowerShell
Remove-Item "$HOME\.claude\.korean-adhd-always","$HOME\.claude\.korean-adhd-company" -ErrorAction SilentlyContinue
```

## Layout and tests

| Path | Content |
| --- | --- |
| `skills/korean-adhd/SKILL.md` | Full rules injected into the session |
| `skills/korean-adhd/references/korean-rules.md` | Detailed rules for long text and editing |
| `skills/korean-adhd/references/company-tone.md` | Company tone option rules |
| `hooks/` | SessionStart hook that injects the rules when the flag exists |
| `tests/run.mjs` | Tests with no dependencies other than git |

Claude Code injects hook output as is up to 10,000 characters and replaces anything longer with a 2,000-character preview, so the tests check the injected size. An actual install injected about 5,100 to 5,500 characters by default and about 6,200 to 6,700 with company tone, depending on install path length. With always-on mode, this much enters the context every session.

```bash
node tests/run.mjs
claude plugin validate .
```

After changing the rules, bump `version` in `.claude-plugin/plugin.json` so users receive the update.

## References

This project references [i-have-adhd](https://github.com/ayghri/i-have-adhd) and [im-not-ai](https://github.com/epoko77-ai/im-not-ai).

## License

MIT. The copyright notices of both originals are included in [`LICENSE`](LICENSE).
