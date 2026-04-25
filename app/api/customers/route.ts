```diff
--- a/app/api/customers/route.ts
+++ b/app/api/customers/route.ts
@@ -1,48 +1,53 @@
-import { NextRequest, NextResponse } from 'next/server';
-import { db } from '@/lib/db';
-import { getServerSession } from '@/lib/auth';
+import { NextRequest, NextResponse } from "next/server";
+import { getServerSession } from "@/lib/auth";
+import { db } from "@/lib/db";
 
-export async function GET(request: NextRequest) {
+export async function GET(req: NextRequest) {
   const session = await getServerSession();
-  if (!session) {
-    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
+  if (!session || !session.user) {
+    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }
 
-  const { searchParams } = new URL(request.url);
-  const search = searchParams.get('search') || '';
-  const stage = searchParams.get('stage') || '';
-  const page = parseInt(searchParams.get('page') || '1');
-  const limit = parseInt(searchParams.get('limit') || '10');
+  const { searchParams } = new URL(req.url);
+  const search = searchParams.get("search") || "";
+  const stage = searchParams.get("stage") || "";
+  const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
+  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "10", 10), 1), 100);
 
-  const result = db.getCustomers({ search, stage, page, limit });
+  const result = db.getCustomers({ search, stage, page, limit });
 
   return NextResponse.json(result);
 }
 
-export async function POST(request: NextRequest) {
+export async function POST(req: NextRequest) {
   const session = await getServerSession();
-  if (!session) {
-    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
+  if (!session || !session.user) {
+    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }
 
   try {
-    const body = await request.json();
+    const body = await req.json();
     const { name, email, phone, company, stage, notes } = body;
 
-    if (!name || !email) {
-      return NextResponse.json(
-        { error: 'Name and email are required' },
-        { status: 400 }
-      );
+    if (!name || !email || typeof name !== "string" || typeof email !== "string") {
+      return NextResponse.json({ error: "Name and email are required and must be strings" }, { status: 400 });
     }
 
     const customer = db.createCustomer({
-      name,
+      name: name.trim(),
       email,
-      phone: phone || '',
-      company: company || '',
-      stage: stage || 'lead',
-      notes: notes || '',
+      phone: phone || "",
+      company: company || "",
+      stage: stage || "lead",
+      notes: notes || "",
     });
 
     return NextResponse.json(customer, { status: 201 });
-  } catch (error) {
-    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
+  } catch (err) {
+    const message = err instanceof Error ? err.message : "Invalid request body";
+    return NextResponse.json({ error: message }, { status: 400 });
   }
 }
```