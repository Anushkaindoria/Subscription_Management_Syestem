import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_INVOICES } from "@/mocks/invoices";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const invoice = MOCK_INVOICES.find((i) => i.id === params.id || i.number === params.id) || MOCK_INVOICES[0];
    return ok({
      invoiceId: invoice.id,
      invoiceNumber: invoice.number,
      subtotalTrace: "1 × ₹1,200.00 + 2 × ₹250.00 = ₹1,700.00",
      discountTrace: "No coupon applied (₹0.00)",
      taxTrace: "CGST 9% (₹153.00) + SGST 9% (₹153.00) = ₹306.00 (18%)",
      grandTotalMinor: invoice.totalAmountMinor,
      lines: invoice.lines,
    });
  } catch (err: any) {
    return fail(err.code || "EXPLAIN_FAILED", err.message, 404);
  }
}
