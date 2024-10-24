import { Requester } from "./requester";
import { ServerFetcher } from "./server-fetcher";

export const serverRequester = new Requester(new ServerFetcher());
