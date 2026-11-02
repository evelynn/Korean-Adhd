// 실행: node tests/run.mjs  (의존성 없음, 전부 통과하면 exit 0)
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hook = path.join(root, "hooks", "always-on.mjs");
const skillPath = path.join(root, "skills", "korean-adhd", "SKILL.md");
const companyPath = path.join(root, "skills", "korean-adhd", "references", "company-tone.md");
const COMPANY_HEAD = "## 회사어투 옵션";
const MAX_INJECTED_CHARS = 10000; // Claude Code 훅 출력 주입 한도

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "korean-adhd-"));
const runHook = (file, configDir) =>
  spawnSync(process.execPath, [file], {
    encoding: "utf8",
    env: { ...process.env, CLAUDE_CONFIG_DIR: configDir },
  });
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));

const tests = {
  "플래그가 없으면 아무것도 주입하지 않는다"() {
    const dir = fs.mkdtempSync(path.join(tmp, "off-"));
    const r = runHook(hook, dir);
    assert.equal(r.status, 0);
    assert.equal(r.stdout, "");
  },
  "플래그가 있으면 머리말 없이 규칙 전문을 주입한다"() {
    const dir = fs.mkdtempSync(path.join(tmp, "on-"));
    fs.writeFileSync(path.join(dir, ".korean-adhd-always"), "");
    const r = runHook(hook, dir);
    assert.equal(r.status, 0);
    assert.match(r.stdout, /^KOREAN-ADHD 모드 켜짐/);
    assert.match(r.stdout, /## 보내기 전 점검/);
    assert.doesNotMatch(r.stdout, /disable-model-invocation/);
  },
  "주입문은 훅 출력 한도 안에 들어간다"() {
    const dir = fs.mkdtempSync(path.join(tmp, "size-"));
    fs.writeFileSync(path.join(dir, ".korean-adhd-always"), "");
    const { stdout } = runHook(hook, dir);
    assert.ok(stdout.length < MAX_INJECTED_CHARS, `${stdout.length}자`);
  },
  "주입문의 참조 경로는 실제 파일을 가리킨다"() {
    const dir = fs.mkdtempSync(path.join(tmp, "ref-"));
    fs.writeFileSync(path.join(dir, ".korean-adhd-always"), "");
    const { stdout } = runHook(hook, dir);
    assert.doesNotMatch(stdout, /CLAUDE_SKILL_DIR/);
    const ref = stdout.match(/`([^`]*references\/korean-rules\.md)`/);
    assert.ok(ref, "참조 경로 없음");
    assert.ok(fs.existsSync(ref[1]), ref[1]);
  },
  "회사어투 플래그가 없으면 옵션 규칙을 주입하지 않는다"() {
    const dir = fs.mkdtempSync(path.join(tmp, "company-off-"));
    fs.writeFileSync(path.join(dir, ".korean-adhd-always"), "");
    const { stdout } = runHook(hook, dir);
    assert.ok(!stdout.includes(COMPANY_HEAD));
    assert.doesNotMatch(stdout, /회사어투 옵션 켜짐/);
  },
  "회사어투 플래그가 있으면 규칙 맨 끝에 주입하고 한도 안에 들어간다"() {
    const dir = fs.mkdtempSync(path.join(tmp, "company-on-"));
    fs.writeFileSync(path.join(dir, ".korean-adhd-always"), "");
    fs.writeFileSync(path.join(dir, ".korean-adhd-company"), "");
    const { stdout } = runHook(hook, dir);
    assert.match(stdout, /회사어투 옵션 켜짐\(상시\)/);
    assert.ok(stdout.indexOf(COMPANY_HEAD) > stdout.indexOf("## 보내기 전 점검"));
    assert.ok(stdout.length < MAX_INJECTED_CHARS, `${stdout.length}자`);
  },
  "회사어투 플래그만 있고 상시 플래그가 없으면 아무것도 주입하지 않는다"() {
    const dir = fs.mkdtempSync(path.join(tmp, "company-only-"));
    fs.writeFileSync(path.join(dir, ".korean-adhd-company"), "");
    const r = runHook(hook, dir);
    assert.equal(r.status, 0);
    assert.equal(r.stdout, "");
  },
  "회사어투 규칙은 금지 어미·표 정리·상태 구분·2·3장 우선을 명시한다"() {
    const rule = fs.readFileSync(companyPath, "utf8");
    assert.match(rule, /"~입니다", "~습니다", "~합니다", "~한다", "~할 수 있습니다"/);
    assert.match(rule, /"~함".*"~완료".*"~적용".*"~확인 필요"/);
    assert.match(rule, /항목별 비교는 표로 정리/);
    assert.match(rule, /적용 완료, 진행 중, 검토 중/);
    assert.match(rule, /확인되지 않은 내용 추측 금지/);
    assert.match(rule, /기술 용어, 수치, 검증 결과는 원문 의미 유지/);
    assert.match(rule, /3장의 짧게와 자연스럽게보다 이 장 우선/);
  },
  "회사어투 예시의 고친 쪽은 금지한 어미로 끝나지 않는다"() {
    const rows = fs.readFileSync(companyPath, "utf8").split(/\r?\n/).filter((l) => /^\| /.test(l)).slice(1);
    assert.ok(rows.length >= 5);
    for (const row of rows) assert.doesNotMatch(row.split("|")[2].trim(), /(입니다|습니다|합니다|한다|해요|까요\?)$/, row);
  },
  "SKILL.md 가 회사어투 켜는 말과 규칙 파일을 안내한다"() {
    const dir = fs.mkdtempSync(path.join(tmp, "company-ref-"));
    fs.writeFileSync(path.join(dir, ".korean-adhd-always"), "");
    const { stdout } = runHook(hook, dir);
    assert.match(stdout, /"회사어투 켜"/);
    assert.match(stdout, /"회사어투 꺼"/);
    const ref = stdout.match(/`([^`]*references\/company-tone\.md)`/);
    assert.ok(ref, "참조 경로 없음");
    assert.ok(fs.existsSync(ref[1]), ref[1]);
  },
  "SKILL.md 가 없어도 세션 시작을 막지 않는다"() {
    const plugin = fs.mkdtempSync(path.join(tmp, "broken-"));
    fs.mkdirSync(path.join(plugin, "hooks"));
    const copy = path.join(plugin, "hooks", "always-on.mjs");
    fs.copyFileSync(hook, copy);
    const dir = fs.mkdtempSync(path.join(tmp, "cfg-"));
    fs.writeFileSync(path.join(dir, ".korean-adhd-always"), "");
    const r = runHook(copy, dir);
    assert.equal(r.status, 0);
    assert.equal(r.stdout, "");
  },
  "매니페스트와 스킬 이름이 일치하고 마켓플레이스 규칙을 지킨다"() {
    const plugin = readJson(".claude-plugin/plugin.json");
    const market = readJson(".claude-plugin/marketplace.json");
    assert.match(plugin.name, /^[a-z0-9]+(-[a-z0-9]+)*$/);
    assert.equal(market.name, plugin.name);
    assert.equal(market.plugins[0].name, plugin.name);
    const frontmatter = fs.readFileSync(skillPath, "utf8").split("---")[1];
    assert.match(frontmatter, new RegExp(`^name: ${plugin.name}$`, "m"));
  },
  "규칙 문서가 스스로 연결어미 뒤 쉼표를 쓰지 않는다"() {
    const lines = [skillPath, companyPath].flatMap((f) => fs.readFileSync(f, "utf8").split(/\r?\n/));
    const hits = lines.filter(
      (l) => /(하고|했고|되고|이고|않고|남기고|맞추고|녹이고|줄이고|빼고|넣고|하며|지만|면서|아서|어서|해서),\s/.test(l) && !l.includes("찍지 않는다"),
    );
    assert.deepEqual(hits, []);
  },
  "두 원작의 MIT 저작권 표시를 유지한다"() {
    const license = fs.readFileSync(path.join(root, "LICENSE"), "utf8");
    assert.match(license, /Ayoub Ghriss/);
    assert.match(license, /epoko77-ai/);
  },
};

let failed = 0;
for (const [name, fn] of Object.entries(tests)) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (e) {
    failed++;
    console.log(`FAIL ${name}: ${e.message}`);
  }
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`${Object.keys(tests).length - failed}/${Object.keys(tests).length} PASS`);
process.exit(failed ? 1 : 0);
