import { ENV } from "./environment";
import * as soap from "soap";

const SOAP_CLIENT = soap.createClientAsync(ENV.WSDL_URL + "", {});

interface Subscription {
  creatorId: number;
  subscriptionId: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}

async function getPendingSubscriptions() {
  const client = await SOAP_CLIENT;

  return new Promise<Subscription[]>((resolve, reject) => {
    client.SubscriptionServiceImplService.SubscriptionServiceImplPort.getPendingSubscription(
      {},
      (err: any, res: any) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(res && res.return);
      }
    );
  });
}

export { getPendingSubscriptions as getPendingSubscription };
