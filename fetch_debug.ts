import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

/**
 * 这个函数是一个异步函数，用于发送网络请求并获取响应。它接受一个输入参数和一个可选的初始化参数，然后创建一个Request对象，使用fetch函数发送请求并获取Promise<Response>类型的响应。接着，它使用assert函数检查响应是否成功，如果成功则打印响应的URL、状态码和状态文本，最后返回响应。
 * @param input
 * @param init
 * @returns
 */
export async function fetch_debug(
    input: string | URL | Request,
    init?: RequestInit | undefined,
): Promise<Response> {
    const request = new Request(input, init);
    console.log(request.url, request.method);
    const response = await fetch(request);
    assert(response.ok, response.status + " " + response.statusText);
    console.log(response.url, response.status, response.statusText);
    return response;
}
