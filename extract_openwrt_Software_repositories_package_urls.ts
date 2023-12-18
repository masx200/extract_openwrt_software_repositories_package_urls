// 导入断言函数，用于测试代码中的条件是否为真，如果条件为假，则抛出错误。

import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";
import { question_and_readline } from "./question_and_readline.ts";

// 导入Node.js的process模块，该模块提供了与当前Node.js进程互动的接口。

// 导入Node.js的readline模块，该模块提供了一个接口用于从可读流中读取数据。

// 如果该模块是主模块（即直接运行的模块），则执行main函数。
if (import.meta.main) {
    main()
        .then(
            () => {
                console.log("done");
            },
            (e) => {
                console.error(e);

                Deno.exit(1);
            },
        )
        .finally(() => Deno.exit(0)); // 程序执行完毕，退出Deno进程。
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
    await extract_openwrt_Software_repositories_package_urls(
        baseurl,
        packages,
        output,
    ); // 将列表元素连接成字符串，每行一个元素，并写入到output文件中。
}
/**
 * 这段代码是一个 TypeScript 函数，通过用户输入的参数获取 OpenWRT 软件仓库包的URL，并将这些URL写入到指定的文件中。函数使用了断言函数来确保输入参数不是假值，并使用了 Deno 的读写文件方法来读取和写入文件。函数还使用了 Node.js 的 readline 模块来从控制台读取用户输入。最后，函数通过异步函数和 async/await 关键字来处理异步操作。
 * @param baseurl
 * @param packages
 * @param output
 */
export async function extract_openwrt_Software_repositories_package_urls(
    baseurl: string,
    packages: string,
    output: string,
) {
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
    await Deno.writeTextFile(output, list.join("\n"));
}
