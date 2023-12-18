/**
 * 这个函数用于显示一个包含特定信息的对象，该信息描述了一个下载OpenWRT软件仓库的功能以及其所需的参数。
 */
export function show_help() {
    console.log(
        JSON.stringify(
            {
                name: "download_openwrt_software_repositories",
                description: "download_openwrt_software_repositories",
                usage:
                    `deno run -A "C:/\Documents/\extract_openwrt_-software_repositories_package_urls/\download_openwrt_software_repositories.ts"  --rpcurl=http://localhost:16800/jsonrpc --repositories_url=https://downloads.openwrt.org/releases/23.05.2/targets/ramips/mt7621/packages/ --download_folder=C:/openwrt软件包镜像源/releases/23.05.2/targets/ramips/mt7621/packages/`,
                arguments: {
                    help: { description: "show help", required: false },
                    rpcurl: {
                        description: "aria2 json rpc url",
                        required: true,
                    },
                    repositories_url: {
                        description: "openwrt repositories url",
                        required: true,
                    },
                    download_folder: {
                        description: "download folder ",
                        required: true,
                    },
                },
            },
            null,
            4,
        ),
    );
}
