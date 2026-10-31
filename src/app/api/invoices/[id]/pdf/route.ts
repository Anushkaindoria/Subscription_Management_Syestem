import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_INVOICES } from "@/mocks/invoices";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff", "customer"]);
    const invoice = MOCK_INVOICES.find((i) => i.id === params.id || i.number === params.id) || MOCK_INVOICES[0];
    return ok({
      pdfUrl: `/storage/invoices/${invoice.number}.pdf`,
      invoiceNumber: invoice.number,
      downloadReady: true,
    });
  } catch (err: any) {
    return fail(err.code || "PDF_FAILED", err.message, 404);
  }
}
