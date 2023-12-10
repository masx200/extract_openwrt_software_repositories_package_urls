import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";
import process from "node:process";
import readline from "node:readline";


if (import.meta.main) {
  main().then(() => {
    console.log("done");
  }, console.error).finally(() => Deno.exit(0));
}
async function main() {
  const baseurl = (await question_and_readline(
    "repositories baseurl:",
  )) as string;
  const packages = (await question_and_readline(
    "input packages filepath:",
  )) as string;
  const output = (await question_and_readline(
    "output urls filepath:",
  )) as string;
  console.log({ baseurl, input: packages, output });

  assert(output);
  assert(packages);
  assert(baseurl);
  const list = (await Deno.readTextFile(packages)) //packages
    .split(/\n+/g)
    .filter((a) => a.startsWith("Filename:") && a.endsWith(".ipk"))
    .map((a) => {
      return new URL(a.replaceAll("Filename: ", baseurl + "/")).href;
    });

  // console.log(list.join("\n"));

  // console.log(list.length);
  await Deno.writeTextFile(output, list.join("\n"));
}
async function question_and_readline(arg0: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(arg0, (answer) => {
      //   console.log(`你输入的文字是：${answer}`);
      rl.close();
      resolve(answer);
    });
  });
}
