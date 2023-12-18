/**
 * 这个函数用于显示一个包含特定信息的对象，该信息描述了一个下载OpenWRT软件仓库的功能以及其所需的参数。
 */
export function show_help() {
    console.log({
        description: "download_openwrt_software_repositories",

        arguments: {
            help: { description: "show help", required: false },
            rpcurl: { description: "aria2 json rpc url", required: true },
            repositories_url: {
                description: "openwrt repositories url",
                required: true,
            },
            download_folder: {
                description: "download folder ",
                required: true,
            },
        },
    });
}
