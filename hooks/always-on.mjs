// SessionStart 훅: 사용자가 플래그 파일을 만들어 둔 경우에만 규칙 전문을 주입한다.
// i-have-adhd(MIT, Ayoub Ghriss)의 always-on 훅을 바탕으로 했다.
// 어떤 실패도 세션 시작을 막지 않는다. 항상 exit 0 으로 끝난다.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

try {
  const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude");
  const flagPath = path.join(claudeDir, ".korean-adhd-always");
  if (!fs.existsSync(flagPath)) process.exit(0);

  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const skillDir = path.join(scriptDir, "..", "skills", "korean-adhd");
  const skillPath = path.join(skillDir, "SKILL.md");
  if (!fs.existsSync(skillPath)) process.exit(0);

  // 머리말을 떼고, 훅에서는 치환되지 않는 ${CLAUDE_SKILL_DIR} 을 실제 경로로 바꾼다.
  const body = fs
    .readFileSync(skillPath, "utf8")
    .replace(/^---[^\S\r\n]*\r?\n[\s\S]*?\r?\n---[^\S\r\n]*(?:\r?\n|$)/, "")
    .replace(/(?:\r?\n)+$/, "")
    .replaceAll("${CLAUDE_SKILL_DIR}", path.resolve(skillDir).replaceAll("\\", "/"));

  process.stdout.write(
    "KOREAN-ADHD 모드 켜짐(상시). 아래 규칙은 모든 답변에 적용한다. " +
      '"stop adhd mode" 또는 "ADHD 모드 꺼"는 이번 세션에서 끈다. ' +
      `상시 켜기를 없애려면 ${flagPath} 를 지운다.\n\n${body}\n`,
  );
} catch {
  process.exit(0);
}
