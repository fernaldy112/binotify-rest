import { ENV } from "./environment";
import * as soap from "soap";

const SOAP_CLIENT = soap.createClientAsync(ENV.WSDL_URL + "", {});

interface Subscription {
  creatorId: number;
  subscriptionId: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}

async function getPendingSubscriptions() {
  // return SOAP_CLIENT.then(async (client) => {
  //   console.log(client.describe());
  //   client.SubscriptionServiceImplService.SubscriptionServiceImplPort.getPendingSubscription(
  //     {},
  //     (err: any, res: any) => {
  //       console.log(err);
  //       console.log(res);
  //       if (err) {
  //         // reject(err);
  //         return;
  //       }
  //       // resolve(res.return);
  //     }
  //   );
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

// (async () => {
//   soap.createClientAsync(ENV.WSDL_URL + "").then(async (client) => {
//     console.log(client.describe());
//     client.SubscriptionServiceImplService.SubscriptionServiceImplPort.getPendingSubscription(
//       {},
//       (err: any, res: any) => {
//         console.log(res);
//       }
//     );
//   });
// })();

export { getPendingSubscriptions as getPendingSubscription };
