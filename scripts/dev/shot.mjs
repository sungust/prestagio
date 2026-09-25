import { chromium } from "@playwright/test";
const [,, url, out, w="1440", h="900", full="1"] = process.argv;
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" }).catch(async()=>chromium.launch());
const p = await b.newPage({ viewport: { width: +w, height: +h } });
const errs=[]; p.on("console", m => m.type()==="error" && errs.push(m.text())); p.on("pageerror", e=>errs.push(String(e)));
await p.goto(url, { waitUntil: "networkidle" });
await p.screenshot({ path: out, fullPage: full==="1" });
if (errs.length) console.log("ERRORS:", errs.join("\n"));
await b.close();
