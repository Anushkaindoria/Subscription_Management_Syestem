import fs from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "..");
const API_DIR = path.join(ROOT, "src", "app", "api");

function writeFile(relPath: string, content: string) {
  const fullPath = path.join(API_DIR, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + "\n");
  console.log(`Created: /api/${relPath.replace(/\\/g, "/")}`);
}

// 1. AUTH
writeFile("auth/login/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { LoginRequestSchema } from "@/contracts/auth";
import { authService } from "@/modules/auth";

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    const body = await parseAndValidate(req, LoginRequestSchema);
    const session = await authService.login(body);
    return ok(session);
  } catch (err: any) {
    return fail("LOGIN_FAILED", err.message || "Invalid credentials", 401, err.fields);
  }
}
`);

writeFile("auth/signup/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { SignupRequestSchema } from "@/contracts/auth";
import { authService } from "@/modules/auth";

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    const body = await parseAndValidate(req, SignupRequestSchema);
    const session = await authService.signup(body);
    return ok(session, 201);
  } catch (err: any) {
    return fail("SIGNUP_FAILED", err.message || "Signup failed", 400, err.fields);
  }
}
`);

writeFile("auth/logout/route.ts", `
import { NextRequest } from "next/server";
import { ok, applyMockDelay } from "@/app/api/_lib/handler";

export async function POST(_req: NextRequest) {
  await applyMockDelay(100);
  return ok({ message: "Successfully logged out" });
}
`);

writeFile("auth/forgot/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { ForgotPasswordRequestSchema } from "@/contracts/auth";
import { authService } from "@/modules/auth";

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    const body = await parseAndValidate(req, ForgotPasswordRequestSchema);
    const res = await authService.requestPasswordReset(body);
    return ok(res);
  } catch (err: any) {
    return fail("FORGOT_PASSWORD_FAILED", err.message, 400, err.fields);
  }
}
`);

writeFile("auth/reset/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { ResetPasswordRequestSchema } from "@/contracts/auth";
import { authService } from "@/modules/auth";

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    const body = await parseAndValidate(req, ResetPasswordRequestSchema);
    const res = await authService.confirmPasswordReset(body);
    return ok(res);
  } catch (err: any) {
    return fail("RESET_PASSWORD_FAILED", err.message, 400, err.fields);
  }
}
`);

writeFile("auth/me/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay(150);
    const user = assertAuth(req);
    return ok(user);
  } catch (err: any) {
    return fail(err.code || "UNAUTHORIZED", err.message, err.status || 401);
  }
}
`);

// 2. CATALOG: PRODUCTS, PLANS, TEMPLATES
writeFile("products/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, paginate, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { CreateProductSchema } from "@/contracts/product";
import { MOCK_PRODUCTS } from "@/mocks/products";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff", "customer"]);
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10);
    return ok(paginate(MOCK_PRODUCTS, page, pageSize));
  } catch (err: any) {
    return fail(err.code || "ERROR", err.message, err.status || 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, CreateProductSchema);
    const product = { id: \`prod_\${Date.now()}\`, ...body, createdAt: new Date().toISOString() };
    return ok(product, 201);
  } catch (err: any) {
    return fail(err.code || "CREATE_PRODUCT_FAILED", err.message, err.status || 400, err.fields);
  }
}
`);

writeFile("products/[id]/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { UpdateProductSchema } from "@/contracts/product";
import { MOCK_PRODUCTS } from "@/mocks/products";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff", "customer"]);
    const product = MOCK_PRODUCTS.find((p) => p.id === params.id) || MOCK_PRODUCTS[0];
    return ok(product);
  } catch (err: any) {
    return fail(err.code || "NOT_FOUND", err.message, 404);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, UpdateProductSchema);
    const product = { ...(MOCK_PRODUCTS.find((p) => p.id === params.id) || MOCK_PRODUCTS[0]), ...body };
    return ok(product);
  } catch (err: any) {
    return fail(err.code || "UPDATE_PRODUCT_FAILED", err.message, err.status || 400, err.fields);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    return ok({ id: params.id, deleted: true });
  } catch (err: any) {
    return fail(err.code || "DELETE_PRODUCT_FAILED", err.message, err.status || 400);
  }
}
`);

writeFile("plans/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, paginate, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { CreatePlanSchema } from "@/contracts/plan";
import { MOCK_PLANS } from "@/mocks/plans";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff", "customer"]);
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10);
    return ok(paginate(MOCK_PLANS, page, pageSize));
  } catch (err: any) {
    return fail(err.code || "ERROR", err.message, err.status || 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, CreatePlanSchema);
    const plan = { id: \`plan_\${Date.now()}\`, ...body, createdAt: new Date().toISOString() };
    return ok(plan, 201);
  } catch (err: any) {
    return fail(err.code || "CREATE_PLAN_FAILED", err.message, err.status || 400, err.fields);
  }
}
`);

writeFile("plans/[id]/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { UpdatePlanSchema } from "@/contracts/plan";
import { MOCK_PLANS } from "@/mocks/plans";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff", "customer"]);
    const plan = MOCK_PLANS.find((p) => p.id === params.id) || MOCK_PLANS[0];
    return ok(plan);
  } catch (err: any) {
    return fail(err.code || "NOT_FOUND", err.message, 404);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, UpdatePlanSchema);
    const plan = { ...(MOCK_PLANS.find((p) => p.id === params.id) || MOCK_PLANS[0]), ...body };
    return ok(plan);
  } catch (err: any) {
    return fail(err.code || "UPDATE_PLAN_FAILED", err.message, err.status || 400, err.fields);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    return ok({ id: params.id, deleted: true });
  } catch (err: any) {
    return fail(err.code || "DELETE_PLAN_FAILED", err.message, err.status || 400);
  }
}
`);

writeFile("templates/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { CreateQuotationTemplateSchema, QuotationTemplate } from "@/contracts/template";

const MOCK_TEMPLATES: QuotationTemplate[] = [
  {
    id: "tmpl_saas_bundle",
    name: "Enterprise Growth Bundle",
    description: "Brightloop CRM Suite + Extra Seats + Priority Support",
    durationMonths: 12,
    active: true,
    lines: [
      { productId: "prod_brightloop_crm", quantity: 1, discountPercent: 10 },
      { productId: "prod_extra_seats", quantity: 5, discountPercent: 10 },
    ],
  },
];

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    return ok(MOCK_TEMPLATES);
  } catch (err: any) {
    return fail(err.code || "ERROR", err.message, err.status || 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, CreateQuotationTemplateSchema);
    const tmpl = { id: \`tmpl_\${Date.now()}\`, ...body };
    return ok(tmpl, 201);
  } catch (err: any) {
    return fail(err.code || "CREATE_TEMPLATE_FAILED", err.message, err.status || 400, err.fields);
  }
}
`);

writeFile("templates/[id]/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    return ok({ id: params.id, name: "Enterprise Growth Bundle", durationMonths: 12, lines: [] });
  } catch (err: any) {
    return fail(err.code || "NOT_FOUND", err.message, 404);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    return ok({ id: params.id, updated: true });
  } catch (err: any) {
    return fail(err.code || "UPDATE_FAILED", err.message, 400);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    return ok({ id: params.id, deleted: true });
  } catch (err: any) {
    return fail(err.code || "DELETE_FAILED", err.message, 400);
  }
}
`);

writeFile("templates/[id]/quote/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { GenerateQuoteFromTemplateSchema } from "@/contracts/template";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const body = await parseAndValidate(req, GenerateQuoteFromTemplateSchema);
    return ok({
      subscriptionNumber: \`SUB-2026-\${Math.floor(1000 + Math.random() * 9000)}\`,
      customerId: body.customerId,
      templateId: params.id,
      status: "quotation",
      generatedAt: new Date().toISOString(),
    }, 201);
  } catch (err: any) {
    return fail(err.code || "QUOTE_GEN_FAILED", err.message, 400, err.fields);
  }
}
`);

// 3. SUBSCRIPTIONS
writeFile("subscriptions/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, paginate, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { CreateSubscriptionSchema } from "@/contracts/subscription";
import { MOCK_SUBSCRIPTIONS } from "@/mocks/subscriptions";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10);
    const status = req.nextUrl.searchParams.get("status");
    let items = MOCK_SUBSCRIPTIONS;
    if (status) items = items.filter((s) => s.status === status);
    return ok(paginate(items, page, pageSize));
  } catch (err: any) {
    return fail(err.code || "ERROR", err.message, err.status || 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const body = await parseAndValidate(req, CreateSubscriptionSchema);
    const sub = {
      id: \`sub_\${Date.now()}\`,
      number: \`SUB-2026-\${Math.floor(1000 + Math.random() * 9000)}\`,
      ...body,
      status: "draft" as const,
      nextBillingDate: null,
    };
    return ok(sub, 201);
  } catch (err: any) {
    return fail(err.code || "CREATE_SUB_FAILED", err.message, err.status || 400, err.fields);
  }
}
`);

writeFile("subscriptions/[id]/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_SUBSCRIPTIONS } from "@/mocks/subscriptions";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === params.id || s.number === params.id) || MOCK_SUBSCRIPTIONS[0];
    return ok(sub);
  } catch (err: any) {
    return fail(err.code || "NOT_FOUND", err.message, 404);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const sub = { ...(MOCK_SUBSCRIPTIONS.find((s) => s.id === params.id) || MOCK_SUBSCRIPTIONS[0]) };
    return ok(sub);
  } catch (err: any) {
    return fail(err.code || "UPDATE_SUB_FAILED", err.message, 400);
  }
}
`);

writeFile("subscriptions/[id]/transition/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { SubscriptionTransitionSchema } from "@/contracts/subscription";
import { MOCK_SUBSCRIPTIONS } from "@/mocks/subscriptions";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const body = await parseAndValidate(req, SubscriptionTransitionSchema);
    const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === params.id) || MOCK_SUBSCRIPTIONS[0];

    const actionToStatus: Record<string, string> = {
      send_quotation: "quotation",
      confirm: "confirmed",
      activate: "active",
      pause: "active",
      resume: "active",
      renew: "active",
      close: "closed",
    };

    const nextStatus = actionToStatus[body.action] || sub.status;
    return ok({ ...sub, status: nextStatus, lastAction: body.action });
  } catch (err: any) {
    return fail(err.code || "TRANSITION_FAILED", err.message, 400, err.fields);
  }
}
`);

// 4. CUSTOMERS
writeFile("customers/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, paginate, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { CreateCustomerSchema } from "@/contracts/customer";
import { MOCK_CUSTOMERS } from "@/mocks/customers";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10);
    return ok(paginate(MOCK_CUSTOMERS, page, pageSize));
  } catch (err: any) {
    return fail(err.code || "ERROR", err.message, err.status || 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const body = await parseAndValidate(req, CreateCustomerSchema);
    const customer = { id: \`cust_\${Date.now()}\`, ...body, createdAt: new Date().toISOString() };
    return ok(customer, 201);
  } catch (err: any) {
    return fail(err.code || "CREATE_CUSTOMER_FAILED", err.message, 400, err.fields);
  }
}
`);

writeFile("customers/[id]/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { UpdateCustomerSchema } from "@/contracts/customer";
import { MOCK_CUSTOMERS } from "@/mocks/customers";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const customer = MOCK_CUSTOMERS.find((c) => c.id === params.id) || MOCK_CUSTOMERS[0];
    return ok(customer);
  } catch (err: any) {
    return fail(err.code || "NOT_FOUND", err.message, 404);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const body = await parseAndValidate(req, UpdateCustomerSchema);
    const customer = { ...(MOCK_CUSTOMERS.find((c) => c.id === params.id) || MOCK_CUSTOMERS[0]), ...body };
    return ok(customer);
  } catch (err: any) {
    return fail(err.code || "UPDATE_CUSTOMER_FAILED", err.message, 400, err.fields);
  }
}
`);

writeFile("customers/[id]/portal-invite/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    return ok({
      success: true,
      customerId: params.id,
      inviteUrl: \`/portal?token=invite_\${params.id}_\${Date.now()}\`,
    });
  } catch (err: any) {
    return fail(err.code || "INVITE_FAILED", err.message, 400);
  }
}
`);

// 5. INVOICES
writeFile("invoices/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, paginate, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_INVOICES } from "@/mocks/invoices";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10);
    return ok(paginate(MOCK_INVOICES, page, pageSize));
  } catch (err: any) {
    return fail(err.code || "ERROR", err.message, err.status || 500);
  }
}
`);

writeFile("invoices/[id]/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_INVOICES } from "@/mocks/invoices";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const invoice = MOCK_INVOICES.find((i) => i.id === params.id || i.number === params.id) || MOCK_INVOICES[0];
    return ok(invoice);
  } catch (err: any) {
    return fail(err.code || "NOT_FOUND", err.message, 404);
  }
}
`);

writeFile("invoices/[id]/confirm/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_INVOICES } from "@/mocks/invoices";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const invoice = MOCK_INVOICES.find((i) => i.id === params.id) || MOCK_INVOICES[0];
    return ok({ ...invoice, status: "confirmed" });
  } catch (err: any) {
    return fail(err.code || "CONFIRM_FAILED", err.message, 400);
  }
}
`);

writeFile("invoices/[id]/cancel/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_INVOICES } from "@/mocks/invoices";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const invoice = MOCK_INVOICES.find((i) => i.id === params.id) || MOCK_INVOICES[0];
    return ok({ ...invoice, status: "cancelled" });
  } catch (err: any) {
    return fail(err.code || "CANCEL_FAILED", err.message, 400);
  }
}
`);

writeFile("invoices/[id]/send/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    return ok({ invoiceId: params.id, sent: true, recipient: "billing@acmeretail.in" });
  } catch (err: any) {
    return fail(err.code || "SEND_FAILED", err.message, 400);
  }
}
`);

writeFile("invoices/[id]/pdf/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_INVOICES } from "@/mocks/invoices";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff", "customer"]);
    const invoice = MOCK_INVOICES.find((i) => i.id === params.id || i.number === params.id) || MOCK_INVOICES[0];
    return ok({
      pdfUrl: \`/storage/invoices/\${invoice.number}.pdf\`,
      invoiceNumber: invoice.number,
      downloadReady: true,
    });
  } catch (err: any) {
    return fail(err.code || "PDF_FAILED", err.message, 404);
  }
}
`);

writeFile("invoices/[id]/explain/route.ts", `
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
`);

// 6. BILLING
writeFile("billing/preview/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { BillingPreviewRequestSchema } from "@/contracts/billing";

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const body = await parseAndValidate(req, BillingPreviewRequestSchema);
    return ok({
      asOfDate: body.asOfDate || new Date().toISOString(),
      dueSubscriptionsCount: 2,
      projectedRevenueMinor: 1842000,
      items: [
        { subscriptionId: "sub_2026_0001", customerName: "Acme Retail Pvt Ltd", periodStart: "2026-11-01", periodEnd: "2026-11-30", amountMinor: 170000 },
        { subscriptionId: "sub_2026_0003", customerName: "Kiran Stores", periodStart: "2026-11-15", periodEnd: "2026-12-14", amountMinor: 150000 },
      ],
    });
  } catch (err: any) {
    return fail(err.code || "PREVIEW_FAILED", err.message, 400, err.fields);
  }
}
`);

writeFile("billing/run/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { BillingRunRequestSchema } from "@/contracts/billing";

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const body = await parseAndValidate(req, BillingRunRequestSchema);
    return ok({
      runId: \`brun_\${Date.now()}\`,
      asOfDate: body.asOfDate || new Date().toISOString(),
      dryRun: body.dryRun,
      subscriptionsEvaluated: 5,
      invoicesGenerated: body.dryRun ? 0 : 2,
      invoicesSkipped: 3,
      failedCount: 0,
      totalBilledMinor: 1842000,
      status: "COMPLETED",
    });
  } catch (err: any) {
    return fail(err.code || "BILLING_RUN_FAILED", err.message, 400, err.fields);
  }
}
`);

writeFile("billing/runs/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    return ok([
      {
        id: "brun_1001",
        asOfDate: "2026-10-01T00:00:00Z",
        dryRun: false,
        subscriptionsEvaluated: 1284,
        invoicesGenerated: 1284,
        invoicesSkipped: 0,
        failedCount: 0,
        totalBilledMinor: 186400000,
        executedAt: "2026-10-01T00:02:14Z",
        status: "COMPLETED",
      },
    ]);
  } catch (err: any) {
    return fail(err.code || "ERROR", err.message, 500);
  }
}
`);

writeFile("billing/runs/[id]/retry-failed/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    return ok({ runId: params.id, retriedCount: 0, successfulCount: 0 });
  } catch (err: any) {
    return fail(err.code || "RETRY_FAILED", err.message, 400);
  }
}
`);

// 7. PAYMENTS
writeFile("payments/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, paginate, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { RecordPaymentSchema, Payment } from "@/contracts/payment";

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
    return ok(paginate(MOCK_PAYMENTS, page, pageSize));
  } catch (err: any) {
    return fail(err.code || "ERROR", err.message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const body = await parseAndValidate(req, RecordPaymentSchema);
    const payment = {
      id: \`pay_\${Date.now()}\`,
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
  } catch (err: any) {
    return fail(err.code || "RECORD_PAYMENT_FAILED", err.message, 400, err.fields);
  }
}
`);

// 8. DISCOUNTS [ADMIN ONLY]
writeFile("discounts/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, paginate, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { CreateDiscountSchema } from "@/contracts/discount";
import { MOCK_DISCOUNTS } from "@/mocks/discounts";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10);
    return ok(paginate(MOCK_DISCOUNTS, page, pageSize));
  } catch (err: any) {
    return fail(err.code || "FORBIDDEN", err.message, err.status || 403);
  }
}

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, CreateDiscountSchema);
    const discount = { id: \`disc_\${Date.now()}\`, ...body, usedCount: 0, createdAt: new Date().toISOString() };
    return ok(discount, 201);
  } catch (err: any) {
    return fail(err.code || "CREATE_DISCOUNT_FAILED", err.message, err.status || 400, err.fields);
  }
}
`);

writeFile("discounts/[id]/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { UpdateDiscountSchema } from "@/contracts/discount";
import { MOCK_DISCOUNTS } from "@/mocks/discounts";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const discount = MOCK_DISCOUNTS.find((d) => d.id === params.id) || MOCK_DISCOUNTS[0];
    return ok(discount);
  } catch (err: any) {
    return fail(err.code || "NOT_FOUND", err.message, err.status || 404);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, UpdateDiscountSchema);
    const discount = { ...(MOCK_DISCOUNTS.find((d) => d.id === params.id) || MOCK_DISCOUNTS[0]), ...body };
    return ok(discount);
  } catch (err: any) {
    return fail(err.code || "UPDATE_DISCOUNT_FAILED", err.message, err.status || 400, err.fields);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    return ok({ id: params.id, deleted: true });
  } catch (err: any) {
    return fail(err.code || "DELETE_FAILED", err.message, err.status || 400);
  }
}
`);

// 9. TAXES [ADMIN ONLY]
writeFile("taxes/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, paginate, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { CreateTaxRuleSchema, TaxRule } from "@/contracts/tax";

const MOCK_TAX_RULES: TaxRule[] = [
  {
    id: "tax_gst_18",
    name: "GST 18% (Standard Rate)",
    code: "GST-18",
    rateBasisPoints: 1800,
    isGst: true,
    cgstRateBasisPoints: 900,
    sgstRateBasisPoints: 900,
    igstRateBasisPoints: 1800,
    active: true,
  },
  {
    id: "tax_gst_zero",
    name: "Zero Rated Export",
    code: "GST-0",
    rateBasisPoints: 0,
    isGst: false,
    active: true,
  },
];

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10);
    return ok(paginate(MOCK_TAX_RULES, page, pageSize));
  } catch (err: any) {
    return fail(err.code || "FORBIDDEN", err.message, err.status || 403);
  }
}

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, CreateTaxRuleSchema);
    const tax = { id: \`tax_\${Date.now()}\`, ...body, createdAt: new Date().toISOString() };
    return ok(tax, 201);
  } catch (err: any) {
    return fail(err.code || "CREATE_TAX_FAILED", err.message, err.status || 400, err.fields);
  }
}
`);

writeFile("taxes/[id]/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { UpdateTaxRuleSchema } from "@/contracts/tax";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    return ok({ id: params.id, name: "GST 18%", rateBasisPoints: 1800, isGst: true });
  } catch (err: any) {
    return fail(err.code || "NOT_FOUND", err.message, err.status || 404);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, UpdateTaxRuleSchema);
    return ok({ id: params.id, ...body });
  } catch (err: any) {
    return fail(err.code || "UPDATE_TAX_FAILED", err.message, err.status || 400, err.fields);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    return ok({ id: params.id, deleted: true });
  } catch (err: any) {
    return fail(err.code || "DELETE_FAILED", err.message, err.status || 400);
  }
}
`);

// 10. STAFF [ADMIN ONLY]
writeFile("staff/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, paginate, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { CreateStaffSchema } from "@/contracts/staff";
import { MOCK_STAFF_MEMBERS } from "@/mocks/users";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10);
    return ok(paginate(MOCK_STAFF_MEMBERS, page, pageSize));
  } catch (err: any) {
    return fail(err.code || "FORBIDDEN", err.message, err.status || 403);
  }
}

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, CreateStaffSchema);
    const staff = { id: \`usr_staff_\${Date.now()}\`, ...body, role: "staff" as const, active: true, createdAt: new Date().toISOString() };
    return ok(staff, 201);
  } catch (err: any) {
    return fail(err.code || "CREATE_STAFF_FAILED", err.message, err.status || 400, err.fields);
  }
}
`);

writeFile("staff/[id]/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { UpdateStaffSchema } from "@/contracts/staff";
import { MOCK_STAFF_MEMBERS } from "@/mocks/users";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, UpdateStaffSchema);
    const staff = { ...(MOCK_STAFF_MEMBERS.find((s) => s.id === params.id) || MOCK_STAFF_MEMBERS[0]), ...body };
    return ok(staff);
  } catch (err: any) {
    return fail(err.code || "UPDATE_STAFF_FAILED", err.message, err.status || 400, err.fields);
  }
}
`);

// 11. REPORTS
writeFile("reports/summary/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_REPORT_SUMMARY } from "@/mocks/reports";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    return ok(MOCK_REPORT_SUMMARY);
  } catch (err: any) {
    return fail(err.code || "ERROR", err.message, err.status || 500);
  }
}
`);

writeFile("reports/revenue/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_REVENUE_TIME_SERIES } from "@/mocks/reports";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    return ok(MOCK_REVENUE_TIME_SERIES);
  } catch (err: any) {
    return fail(err.code || "ERROR", err.message, err.status || 500);
  }
}
`);

writeFile("reports/subscriptions/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    return ok({
      totalActive: 1284,
      byPlan: [
        { plan: "Starter Monthly", count: 840, mrrMinor: 125916000 },
        { plan: "Business Yearly", count: 444, mrrMinor: 60484000 },
      ],
    });
  } catch (err: any) {
    return fail(err.code || "ERROR", err.message, err.status || 500);
  }
}
`);

writeFile("reports/payments/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    return ok({
      collectedThisMonthMinor: 245630000,
      methods: [
        { method: "bank_transfer", totalMinor: 140000000, count: 62 },
        { method: "upi", totalMinor: 85630000, count: 210 },
        { method: "card", totalMinor: 20000000, count: 45 },
      ],
    });
  } catch (err: any) {
    return fail(err.code || "ERROR", err.message, err.status || 500);
  }
}
`);

writeFile("reports/overdue/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_OVERDUE_INVOICES } from "@/mocks/reports";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    return ok(MOCK_OVERDUE_INVOICES);
  } catch (err: any) {
    return fail(err.code || "ERROR", err.message, err.status || 500);
  }
}
`);

// 12. ASK
writeFile("ask/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { AskRequestSchema } from "@/contracts/ask";
import { askService } from "@/modules/ask";

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const body = await parseAndValidate(req, AskRequestSchema);
    const result = await askService.processQuery(body);
    return ok(result);
  } catch (err: any) {
    return fail(err.code || "ASK_FAILED", err.message, 400, err.fields);
  }
}
`);

// 13. SETTINGS [ADMIN ONLY]
writeFile("settings/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { UpdateSettingsSchema } from "@/contracts/settings";
import { settingsService } from "@/modules/settings";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const settings = await settingsService.getSettings();
    return ok(settings);
  } catch (err: any) {
    return fail(err.code || "FORBIDDEN", err.message, err.status || 403);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, UpdateSettingsSchema);
    const updated = await settingsService.updateSettings(body);
    return ok(updated);
  } catch (err: any) {
    return fail(err.code || "UPDATE_SETTINGS_FAILED", err.message, err.status || 400, err.fields);
  }
}
`);

// 14. PORTAL (Customer ID ALWAYS from session)
writeFile("portal/summary/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_INVOICES } from "@/mocks/invoices";
import { MOCK_SUBSCRIPTIONS } from "@/mocks/subscriptions";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const customerId = user.customerId || "cust_acme_retail";
    const subs = MOCK_SUBSCRIPTIONS.filter((s) => s.customerId === customerId);
    const invs = MOCK_INVOICES.filter((i) => i.customerId === customerId);

    return ok({
      customerId,
      customerName: user.name,
      activeSubscriptionsCount: subs.filter((s) => s.status === "active").length,
      totalMonthlySpendMinor: 170000,
      outstandingInvoicesCount: invs.filter((i) => i.balanceMinor > 0).length,
      totalOutstandingMinor: 200600,
      recentInvoices: invs,
      subscriptions: subs,
    });
  } catch (err: any) {
    return fail(err.code || "UNAUTHORIZED", err.message, err.status || 401);
  }
}
`);

writeFile("portal/subscriptions/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, paginate, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_SUBSCRIPTIONS } from "@/mocks/subscriptions";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const customerId = user.customerId || "cust_acme_retail";
    const subs = MOCK_SUBSCRIPTIONS.filter((s) => s.customerId === customerId);
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10);
    return ok(paginate(subs, page, pageSize));
  } catch (err: any) {
    return fail(err.code || "UNAUTHORIZED", err.message, err.status || 401);
  }
}
`);

writeFile("portal/subscriptions/[id]/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_SUBSCRIPTIONS } from "@/mocks/subscriptions";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const customerId = user.customerId || "cust_acme_retail";
    const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === params.id && s.customerId === customerId);
    if (!sub) return fail("NOT_FOUND", "Subscription not found", 404);
    return ok(sub);
  } catch (err: any) {
    return fail(err.code || "UNAUTHORIZED", err.message, err.status || 401);
  }
}
`);

writeFile("portal/subscriptions/[id]/transition/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { PortalTransitionSchema } from "@/contracts/portal";
import { MOCK_SUBSCRIPTIONS } from "@/mocks/subscriptions";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const customerId = user.customerId || "cust_acme_retail";
    const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === params.id && s.customerId === customerId);
    if (!sub) return fail("NOT_FOUND", "Subscription not found", 404);

    const body = await parseAndValidate(req, PortalTransitionSchema);
    // Action allowed only if plan flags permit (e.g. pausable, renewable)
    const nextStatus = body.action === "close" ? "closed" : sub.status;
    return ok({ ...sub, status: nextStatus, actionApplied: body.action });
  } catch (err: any) {
    return fail(err.code || "TRANSITION_FAILED", err.message, 400, err.fields);
  }
}
`);

writeFile("portal/invoices/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, paginate, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_INVOICES } from "@/mocks/invoices";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const customerId = user.customerId || "cust_acme_retail";
    const invs = MOCK_INVOICES.filter((i) => i.customerId === customerId);
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10);
    return ok(paginate(invs, page, pageSize));
  } catch (err: any) {
    return fail(err.code || "UNAUTHORIZED", err.message, err.status || 401);
  }
}
`);

writeFile("portal/invoices/[id]/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_INVOICES } from "@/mocks/invoices";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const customerId = user.customerId || "cust_acme_retail";
    const inv = MOCK_INVOICES.find((i) => (i.id === params.id || i.number === params.id) && i.customerId === customerId);
    if (!inv) return fail("NOT_FOUND", "Invoice not found", 404);
    return ok(inv);
  } catch (err: any) {
    return fail(err.code || "UNAUTHORIZED", err.message, err.status || 401);
  }
}
`);

writeFile("portal/invoices/[id]/pdf/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_INVOICES } from "@/mocks/invoices";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const customerId = user.customerId || "cust_acme_retail";
    const inv = MOCK_INVOICES.find((i) => (i.id === params.id || i.number === params.id) && i.customerId === customerId);
    if (!inv) return fail("NOT_FOUND", "Invoice not found", 404);
    return ok({
      pdfUrl: \`/storage/invoices/\${inv.number}.pdf\`,
      invoiceNumber: inv.number,
      downloadReady: true,
    });
  } catch (err: any) {
    return fail(err.code || "PDF_FAILED", err.message, 404);
  }
}
`);

writeFile("portal/invoices/[id]/pay/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { PortalPayInvoiceSchema } from "@/contracts/portal";
import { MOCK_INVOICES } from "@/mocks/invoices";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const customerId = user.customerId || "cust_acme_retail";
    const inv = MOCK_INVOICES.find((i) => i.id === params.id && i.customerId === customerId);
    if (!inv) return fail("NOT_FOUND", "Invoice not found", 404);

    const body = await parseAndValidate(req, PortalPayInvoiceSchema);
    return ok({
      paymentId: \`pay_\${Date.now()}\`,
      invoiceId: inv.id,
      amountPaid: body.amount,
      method: body.method,
      status: "SUCCEEDED",
      invoiceStatus: "paid",
      remainingBalanceMinor: 0,
    });
  } catch (err: any) {
    return fail(err.code || "PAYMENT_FAILED", err.message, 400, err.fields);
  }
}
`);

writeFile("portal/profile/route.ts", `
import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { UpdateProfileSchema } from "@/contracts/auth";
import { MOCK_CUSTOMERS } from "@/mocks/customers";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const customer = MOCK_CUSTOMERS.find((c) => c.id === (user.customerId || "cust_acme_retail")) || MOCK_CUSTOMERS[0];
    return ok({ user, customer });
  } catch (err: any) {
    return fail(err.code || "UNAUTHORIZED", err.message, err.status || 401);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const body = await parseAndValidate(req, UpdateProfileSchema);
    return ok({ message: "Profile updated successfully", updatedFields: Object.keys(body) });
  } catch (err: any) {
    return fail(err.code || "PROFILE_UPDATE_FAILED", err.message, 400, err.fields);
  }
}
`);

console.log("All API route stubs generated successfully!");
