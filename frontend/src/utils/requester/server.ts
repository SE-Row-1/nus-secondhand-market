import { Requester } from "./requester";
import { ServerFetcher } from "./server-fetcher";

export class ServerRequester extends Requester {
  protected override createFetcher() {
    return new ServerFetcher();
  }
}
