import { NextRequest } from "next/server";
import { ok, assertAuth, paginate, applyMockDelay, parseAndValidate, handleError } from "@/app/api/_lib/handler";
import { RecordPaymentSchema, Payment } from "@/contracts/payment";
import { paymentService } from "@/modules/payments";

const MOCK_PAYMENTS: Payment[] = [
  {
    id: "pay_101",
    invoiceId: "inv_2026_0042",
    invoiceNumber: "INV-2026-0042",
    customerId: "cust_acme_retail",
    customerName: "Acme Retail Pvt Ltd",
    method: "bank_transfer",
    amount: 200600,
    paidOn: "2026-10-10",
    note: "NEFT UTR 9876543210",
    status: "SUCCEEDED",
    createdAt: "2026-10-10T14:30:00Z",
  },
];

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10);
    if (process.env.MOCK_API !== "true") {
      return ok(await paymentService.listPayments(page, pageSize));
    }
    return ok(paginate(MOCK_PAYMENTS, page, pageSize));
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["admin", "staff"]);
    const body = await parseAndValidate(req, RecordPaymentSchema);

    if (process.env.MOCK_API !== "true") {
      const receipt = await paymentService.recordPayment({
        invoiceId: body.invoiceId,
        amount: body.amount,
        method: body.method,
        note: body.note,
        recordedById: user.id,
      });
      return ok(
        {
          ...receipt.payment,
          paidOn: body.paidOn,
          invoiceFullyPaid: receipt.invoiceFullyPaid,
          remainingBalanceMinor: receipt.remainingBalanceMinor,
        },
        201,
      );
    }

    const payment = {
      id: `pay_${Date.now()}`,
      invoiceId: body.invoiceId,
      customerId: "cust_acme_retail",
      method: body.method,
      amount: body.amount,
      paidOn: body.paidOn,
      note: body.note,
      status: "SUCCEEDED" as const,
      createdAt: new Date().toISOString(),
    };
    return ok(payment, 201);
  } catch (err) {
    return handleError(err);
  }
}
