import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";
import { ensureDir } from "https://deno.land/std@0.209.0/fs/mod.ts";
import { join } from "node:path";
import { extract_openwrt_Software_repositories_package_urls } from "./extract_openwrt_Software_repositories_package_urls.ts";
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
    await download_openwrt_software_repositories(
        "https://downloads.openwrt.org/releases/23.05.2/targets/ramips/mt7621/packages/",
        "C:/openwrt软件包镜像源/releases/23.05.2/targets/ramips/mt7621/packages/"
    );
    await download_openwrt_software_repositories(
        "https://downloads.openwrt.org/releases/23.05.2/targets/x86/64/packages/",
        "C:/openwrt软件包镜像源/releases/23.05.2/targets/x86/64/packages/"
    );
}

export async function fetch_debug(
    input: string | URL | Request,
    init?: RequestInit | undefined
): Promise<Response> {
    const request = new Request(input, init);
    console.log(request.url, request.method);
    const response = await fetch(request);
    assert(response.ok, response.status + " " + response.statusText);
    console.log(response.url, response.status, response.statusText);
    return response;
}
export async function download_openwrt_software_repositories(
    repositories_url: string,
    download_folder: string
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

    // );
    // .body.pipeThrough(new DecompressionStream("gzip"))
    // ).text()
    // );
}
