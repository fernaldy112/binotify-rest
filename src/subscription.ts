import { ENV } from "./environment";
import * as soap from "soap";
import { Request, Response } from "express";
import { anyOf, isValidId } from "./util";

const SOAP_CLIENT = (async () => {
  const client = await soap.createClientAsync(ENV.WSDL_URL + "", {});
  client.addSoapHeader({
    "tns:ApiKey": ENV.API_KEY,
  });
  return client;
})();

type UpdatedStatus = "ACCEPTED" | "REJECTED";

interface Subscription {
  creatorId: number;
  subscriptionId: number;
  status: "PENDING" | UpdatedStatus;
}

async function getPendingSubscriptions(page: number) {
  const client = await SOAP_CLIENT;

  return new Promise<Subscription[]>((resolve, reject) => {
    client.SubscriptionServiceImplService.SubscriptionServiceImplPort.getPendingSubscription(
      {
        arg0: page,
      },
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

async function handleUpdateSubscription(
  req: Request,
  res: Response,
  status: UpdatedStatus
) {
  const { creatorId, subscriberId } = req.body;

  if (
    anyOf(
      !!creatorId,
      !!subscriberId,
      isValidId(creatorId),
      isValidId(subscriberId)
    ).is(false)
  ) {
    res.status(400);
    res.end();
    return;
  }

  updateSubscription(creatorId, subscriberId, status)
    .then(() => {
      res.status(200);
      res.end();
    })
    .catch(() => {
      res.status(500);
      res.end();
      return;
    });
}

async function updateSubscription(
  creatorId: number,
  subscriberId: number,
  status: UpdatedStatus
) {
  const client = await SOAP_CLIENT;

  return new Promise<void>((resolve, reject) => {
    const method = status == "ACCEPTED" ? "acceptRequest" : "rejectRequest";
    client.SubscriptionServiceImplService.SubscriptionServiceImplPort[method](
      {
        arg0: creatorId,
        arg1: subscriberId,
      },
      (err: any, _: any) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(void 0);
      }
    );
  });
}

async function getSubscriptionStatus(creatorId: number, subscriberId: number) {
  const client = await SOAP_CLIENT;
  let status =
    client.SubscriptionServiceImplService.SubscriptionServiceImplPort.getStatus(
      creatorId,
      subscriberId
    );
  return status;
}

export {
  getPendingSubscriptions,
  updateSubscription,
  handleUpdateSubscription,
  getSubscriptionStatus,
};
