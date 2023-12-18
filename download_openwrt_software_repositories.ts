import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";
import { ensureDir } from "https://deno.land/std@0.209.0/fs/mod.ts";
import { join } from "node:path";
import { extract_openwrt_Software_repositories_package_urls } from "./extract_openwrt_Software_repositories_package_urls.ts";
import { fetch_debug } from "./fetch_debug.ts";
import { makerpcdata } from "./makerpcdata.ts";
import { requestjsonrpc } from "./requestjsonrpc.ts";


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
    const rpcurl = "http://localhost:16800/jsonrpc";
    await download_openwrt_software_repositories(
        "https://downloads.openwrt.org/releases/23.05.2/targets/ramips/mt7621/packages/",
        "C:/openwrt软件包镜像源/releases/23.05.2/targets/ramips/mt7621/packages/",
        rpcurl
    );
    await download_openwrt_software_repositories(
        "https://downloads.openwrt.org/releases/23.05.2/targets/x86/64/packages/",
        "C:/openwrt软件包镜像源/releases/23.05.2/targets/x86/64/packages/",
        rpcurl
    );
}

export async function download_openwrt_software_repositories(
    repositories_url: string,
    download_folder: string,
    rpcurl: string
) {
    console.log({ repositories_url, download_folder });
    assert(repositories_url);
    assert(download_folder);
    // await new Response(
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
    await requestjsonrpc(makerpcdata(file_urls, download_folder), rpcurl);
    // );
    // .body.pipeThrough(new DecompressionStream("gzip"))
    // ).text()
    // );
}
