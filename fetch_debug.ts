import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";


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
