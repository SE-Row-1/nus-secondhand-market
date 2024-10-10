import { ClientFetcher } from "./client-fetcher";
import { Requester } from "./requester";

export class ClientRequester extends Requester {
  protected override createFetcher() {
    return new ClientFetcher();
  }
}
