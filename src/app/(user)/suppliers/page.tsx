import React from 'react'
import { z } from "zod"

const SuppliersPage = async() => {

const supplierSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
})

// Try to parse invalid data
const result = supplierSchema.safeParse({
  name: "",
  email: "not-an-email",
})

if (!result.success) {
  console.log(JSON.stringify(result, null, 2))
}

  return (
    <div>
      Suppliers
     
    </div>
  )
}

export default SuppliersPage
