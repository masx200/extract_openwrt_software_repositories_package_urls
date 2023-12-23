import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";
import { ensureDir } from "https://deno.land/std@0.209.0/fs/mod.ts";
import { join } from "node:path";
import parse from "npm:@masx200/mini-cli-args-parser@1.1.0";
import { extract_openwrt_Software_repositories_package_urls } from "./extract_openwrt_Software_repositories_package_urls.ts";
import { fetch_debug } from "./fetch_debug.ts";
import { makerpcdata } from "./makerpcdata.ts";
import { requestjsonrpc } from "./requestjsonrpc.ts";
import { show_help } from "./show_help.ts";

if (import.meta.main) {
    main()
        .then(
            () => {
                console.log("done");
            },
            (e) => {
                console.error(e);

                Deno.exit(1);
            }
        )
        .finally(() => Deno.exit(0)); // 程序执行完毕，退出Deno进程。
}

async function main() {
    // console.log(Deno.execPath());
    // console.log(Deno.mainModule);
    // console.log(Deno.args);

    const args = parse(Deno.args.slice(0));

    // const rpcurl = "http://localhost:16800/jsonrpc";
    // await download_openwrt_software_repositories(
    //     "https://downloads.openwrt.org/releases/23.05.2/targets/ramips/mt7621/packages/",
    //     "C:/openwrt软件包镜像源/releases/23.05.2/targets/ramips/mt7621/packages/",
    //     rpcurl
    // );
    // await download_openwrt_software_repositories(
    //     "https://downloads.openwrt.org/releases/23.05.2/targets/x86/64/packages/",
    //     "C:/openwrt软件包镜像源/releases/23.05.2/targets/x86/64/packages/",
    //     rpcurl
    // );

    console.log(args);

    if (args.help) {
        show_help();
        return;
    }

    const { rpcurl, repositories_url, download_folder } = args;

    if (
        typeof rpcurl !== "string" ||
        typeof repositories_url !== "string" ||
        typeof download_folder !== "string"
    ) {
        show_help();
        Deno.exit(1);
    } else {
        await download_openwrt_software_repositories(
            repositories_url,
            download_folder,
            rpcurl
        );
    }
}
/**
 * // 下载 OpenWRT 软件包
 * 这个typescript函数是一个异步函数，用于下载OpenWRT软件包。它使用了一些其他的函数和模块，如assert、fetch_debug、ensureDir、join、parse、extract_openwrt_Software_repositories_package_urls、requestjsonrpc和show_help。该函数首先使用parse函数解析命令行参数，然后根据参数值进行一些判断和提取。最后调用download_openwrt_software_repositories函数来下载OpenWRT软件包，并处理一些异常情况。
 * @param repositories_url
 *
 * @param download_folder
 * @param rpcurl
 */

export async function download_openwrt_software_repositories(
    repositories_url: string,
    download_folder: string,
    rpcurl: string
) {
    console.log({ repositories_url, download_folder, rpcurl });

    assert(repositories_url);
    assert(download_folder);
    assert(rpcurl);

    const response = await fetch_debug(
        new URL(repositories_url + "/" + "Packages.gz").href
    );
    assert(response.ok, response.status + " " + response.statusText);

    await ensureDir(download_folder);

    const outputFilePath = join(download_folder, "Packages.gz");
    const PackagesGz = new Uint8Array(await response.arrayBuffer());
    await Deno.writeFile(outputFilePath, PackagesGz);

    const text = await new Response(
        new Response(PackagesGz).body?.pipeThrough(
            new DecompressionStream("gzip")
        )
    ).text();

    const PackageFilePath = join(download_folder, "Packages");
    await Deno.writeTextFile(PackageFilePath, text);

    await extract_openwrt_Software_repositories_package_urls(
        repositories_url,
        PackageFilePath,
        join(download_folder, "urls.txt")
    );

    const file_urls = (
        await Deno.readTextFile(join(download_folder, "urls.txt"))
    )
        .split("\n")
        .filter(Boolean);
    const array: string[] = file_urls; //[...]; // your array here
    /* connection error: 你的主机中的软件中止了一个已建立的连接。 (os error 10053)
    
    你可以使用 TypeScript 的 for...of 循环和 Array.prototype.slice 方法来每次打印100项数组元素。以下是一个示例：
    
    在这个示例中，我们首先定义了一个数组 array。然后，我们使用一个 while 循环来迭代数组。在每次循环中，我们使用 slice 方法获取从当前索引 i 到 i + 100 的数组片段，并将其打印出来。然后，我们将 i 增加100，以便在下一次循环中获取下一个100个元素。这个过程会一直重复，直到我们已经打印了所有的数组元素。 */
    let i = 0;
    while (i < array.length) {
        //console.log(array.slice(i, i + 100));
        await requestjsonrpc(
            makerpcdata(array.slice(i, i + 100), download_folder),
            rpcurl
        );
        i += 100;
    }
    //  await requestjsonrpc(makerpcdata(file_urls, download_folder), rpcurl);
    // );
    // .body.pipeThrough(new DecompressionStream("gzip"))
    // ).text()
    // );
}
