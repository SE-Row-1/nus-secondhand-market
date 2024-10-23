import { ClientFetcher } from "./client-fetcher";
import { Requester } from "./requester";

export const clientRequester = new Requester(new ClientFetcher());
