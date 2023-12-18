import { fetch_debug } from "./fetch_debug.ts";
/**
 * 这个typescript函数是一个异步函数，它向指定的rpcurl发送JSON-RPC请求。它将data和rpcurl作为参数，并使用fetch_debug函数发送HTTP POST请求。如果响应状态不是200，则抛出错误。如果响应的content-type不是application/json-rpc，则抛出错误。否则，返回响应的json数据。
 * @param data
 * @param rpcurl
 * @returns
 */

export async function requestjsonrpc(data: Array<Object>, rpcurl: string) {
    const response = await fetch_debug(rpcurl, {
        headers: {
            connection: "keep-alive",
            accept: "application/json,text/javascript",
            "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/json",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
        },
        referrerPolicy: "no-referrer-when-downgrade",
        body: JSON.stringify(data),
        method: "POST",
    });
    if (!response.ok) {
        throw new Error(response.status + response.statusText);
    }
    const contenttype = response.headers.get("content-type");
    if ("application/json-rpc" !== contenttype) {
        throw new Error("content-type:" + contenttype);
    }
    return await response.json();
}
