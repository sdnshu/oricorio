import { createSubscription } from "./handlers/create-subscription";
import { getSubscriptions } from "./handlers/get-subscriptions";

// export async function GET(request: Request) {
//     // return new Response("GET /api/subscriptions");
//     return await getSubscriptions(request)
// }

// export async function POST(request: Request) {
//     // return new Response("POST /api/subscriptions");
//     return await createSubscription(request)
// }

export const GET = getSubscriptions;
export const POST = createSubscription;