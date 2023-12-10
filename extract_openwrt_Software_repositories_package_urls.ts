// 导入断言函数，用于测试代码中的条件是否为真，如果条件为假，则抛出错误。

import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";
import process from "node:process";
import readline from "node:readline";

// 导入Node.js的process模块，该模块提供了与当前Node.js进程互动的接口。

// 导入Node.js的readline模块，该模块提供了一个接口用于从可读流中读取数据。

// 如果该模块是主模块（即直接运行的模块），则执行main函数。
if (import.meta.main) {
  main().then(() => {
    console.log("done");
  }, console.error).finally(() => Deno.exit(0)); // 程序执行完毕，退出Deno进程。
}

// 定义一个异步的main函数，这是程序的入口点。
async function main() {
  // 通过question_and_readline函数获取用户输入的repositories baseurl。
  const baseurl = (await question_and_readline(
    "repositories baseurl:",
  )) as string;
  // 通过question_and_readline函数获取用户输入的packages文件路径。
  const packages = (await question_and_readline(
    "input packages filepath:",
  )) as string;
  // 通过question_and_readline函数获取用户输入的output文件路径。
  const output = (await question_and_readline(
    "output urls filepath:",
  )) as string;
  // 打印获取到的用户输入信息。
  console.log({ baseurl, input: packages, output });

  // 使用断言函数确保获取的baseurl、packages和output都不是假值（例如null、undefined等）。
  assert(output);
  assert(packages);
  assert(baseurl);
  const list = (await Deno.readTextFile(packages)) // 读取packages文件的内容。
    .split(/\n+/g) // 按换行符分割成数组。
    .filter((a) => a.startsWith("Filename:") && a.endsWith(".ipk")) // 过滤出以"Filename:"开头且以".ipk"结尾的元素。
    .map((a) => {
      // 将过滤出的元素替换成完整的URL，并返回URL的href属性（即字符串形式的URL）。
      return new URL(a.replaceAll("Filename: ", baseurl + "/")).href;
    });

  // 将处理后的URL列表写入到output指定的文件中。
  await Deno.writeTextFile(output, list.join("\n")); // 将列表元素连接成字符串，每行一个元素，并写入到output文件中。
}

// 定义一个异步的question_and_readline函数，该函数接收一个字符串参数arg0，并返回一个Promise<string>。
async function question_and_readline(arg0: string): Promise<string> {
  // 创建一个readline接口实例。
  const rl = readline.createInterface({
    input: process.stdin, // 将接口的标准输入流设置为process.stdin。
    output: process.stdout, // 将接口的标准输出流设置为process.stdout。
  });
  // 返回一个Promise，该Promise在rl.question方法被调用并接收到用户输入后解析。
  return new Promise((resolve, j) => {
    rl.question(arg0, (answer) => {
      // 当用户输入完成后，关闭readline接口并解析Promise，返回用户的输入内容。
      rl.close();
      resolve(answer);
    });
    rl.on("error", j);
  });
}
