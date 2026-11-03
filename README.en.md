# Korean-Adhd

[한국어](README.md) | [한국어 회사어투](README.company.md) | **English**

A Claude Code plugin that makes Korean replies immediately actionable and strips out translated-sounding phrasing and AI clichés.

It combines the reply rules of [i-have-adhd](https://github.com/ayghri/i-have-adhd) with the Korean writing rules of [im-not-ai](https://github.com/epoko77-ai/im-not-ai).

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

1. For the current session only, turn the rules on with `/korean-adhd:korean-adhd`, then say "회사어투 켜" (company tone on). Say "회사어투 꺼" (company tone off) to turn it off.
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

Actual replies are in Korean. This table shows the same change in English.

| Default | Company tone |
| --- | --- |
| I checked the DB and fixed it. | DB checked, fix complete |
| The cause is the cache. | Cause: cache |
| The server needs to be restarted. | Server restart required |
| We will deploy tomorrow. | Deployment scheduled for tomorrow |
| The cache may be the cause. | Cache possibly the cause (needs checking) |
| Next: please paste the first failing line. | Next: first failing line requested |

### Report example

Written by hand to illustrate the rules. Shown in English. Actual replies are in Korean.

Default:

> I checked the login error. The cause looks like the cache, but that is not certain yet. Three tests failed and we plan to deploy tomorrow.

Company tone:

> Login error check complete
>
> Cause: possibly cache (needs checking)
>
> 3 tests failed
>
> Deployment scheduled for tomorrow
>
> Next: first line of failure log requested

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

The plugin rewrites Korean sentences. These pairs show the same kinds of fix in English.

| Before | After |
| --- | --- |
| When it comes to deployment, the point of importance is environment variables. | What matters in deployment is environment variables. |
| Verification is carried out by means of the file generated by the script. | We verify with the file the script made. |
| It is in possession of strong performance. | It performs well. |
| In conclusion, it is the case that the cache is the cause. | The cause is the cache. |

## Turning it on and off

| Goal | How |
| --- | --- |
| Turn on for this session | Type `/korean-adhd:korean-adhd` |
| Turn off for this session | Say "ADHD 모드 꺼" (ADHD mode off), "normal mode" or "stop adhd mode" |
| Turn on for every new session | Create `~/.claude/.korean-adhd-always` |
| Stop turning on for new sessions | Delete that file |
| Company tone on or off for this session | With the rules on, say "회사어투 켜" (on) or "회사어투 꺼" (off) |
| Company tone for every new session | Create `~/.claude/.korean-adhd-company` |
| Stop company tone for new sessions | Delete that file |

The company tone file only works together with the `.korean-adhd-always` file. With the always-on file present, the rules are injected again after compaction or `/clear`, even if you turned them off during the session.

## License

MIT. The copyright notices of both originals are included in [`LICENSE`](LICENSE).
