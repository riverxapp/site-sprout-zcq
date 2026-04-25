import { CustomerForm } from "@/app/(dashboard)/components/customer-form"

export const metadata = {
  title: "New Customer",
}

export default function NewCustomerPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Customer</h1>
          <p className="text-muted-foreground">Add a new customer to your CRM.</p>
        </div>
      </div>
      <CustomerForm />
    </div>
  )
}
