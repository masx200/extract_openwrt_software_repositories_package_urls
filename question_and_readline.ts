import process from "node:process";
import readline from "node:readline";

/**
 * // 定义一个异步的question_and_readline函数，该函数接收一个字符串参数arg0，并返回一个Promise<string>。
 * 这个函数是一个异步函数，它创建一个readline接口实例，通过调用rl.question方法向用户提问，并等待用户输入。当用户输入完成后，函数解析Promise并返回用户输入的内容。
 * @param arg0
 * @returns
 */
export function question_and_readline(arg0: string): Promise<string> {
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
