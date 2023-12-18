export function show_help() {
    console.log({
        description: "download_openwrt_software_repositories",

        arguments: {
            help: { description: "show help" },
            rpcurl: { description: "aria2 json rpc url" },
            repositories_url: { description: "openwrt repositories url" },
            download_folder: { description: "download folder " },
        },
    });
}
