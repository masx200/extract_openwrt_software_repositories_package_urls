/**
 * 这个函数用于创建RPC数据，它接受一个文件URL列表和一个目录名作为参数，并返回一个包含文件URL的RPC数据对象的数组。每个RPC数据对象包含jsonrpc、method、id和params属性，其中params属性是一个数组，包含一个URL、一个包含请求头、目录名、分片大小和最大并发连接数的对象。
 * @param fileurls
 *
 * @param directoryname
 * @returns
 */
export function makerpcdata(
    fileurls: string[],
    directoryname: string,
): Array<Object> {
    const data = fileurls.map((url) => {
        const origin = new URL(url).origin + "/";
        return {
            jsonrpc: "2.0",
            method: "aria2.addUri",
            id: 1,
            params: [
                [url],
                {
                    header: [
                        "Referer: " + origin,
                        "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
                    ].join("\n"),
                    dir: directoryname,
                    split: "16",
                    "max-connection-per-server": "16",
                    "seed-ratio": "1.0",
                },
            ],
        };
    });
    return data;
}
