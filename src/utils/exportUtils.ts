import { SalesRecord } from "@/types/sales";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToExcel = (data: SalesRecord[], filename: string = "sales-data") => {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map((record) => ({
      Timestamp: record.timestamp,
      "Sales Rep": record.salesRepName,
      "Customer Name": record.customerName,
      "Date of Sale": record.dateOfSale,
      Address: record.address,
      Phone: record.customerPhone,
      Plan: record.plan,
      "Amount Paid": record.amountPaid,
      "Payment Status": record.paymentStatus,
      Notes: record.finalNotes,
      Email: record.customerEmail,
      NIN: record.customerNIN,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Data");

  XLSX.writeFile(workbook, `${filename}-${new Date().toISOString().split("T")[0]}.xlsx`);
};

export const exportToPDF = (data: SalesRecord[], filename: string = "sales-report") => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("FiberX Sales Manager Report", 14, 20);

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  doc.text(`Total Records: ${data.length}`, 14, 36);
  doc.text(
    `Total Revenue: ₦${data.reduce((sum, r) => sum + r.amountPaid, 0).toLocaleString()}`,
    14,
    42
  );

  const tableData = data.map((record) => [
    record.customerName,
    record.customerPhone,
    record.salesRepName,
    record.plan,
    `₦${record.amountPaid.toLocaleString()}`,
    record.paymentStatus,
    new Date(record.dateOfSale).toLocaleDateString(),
  ]);

  autoTable(doc, {
    head: [["Customer", "Phone", "Sales Rep", "Plan", "Amount", "Status", "Date"]],
    body: tableData,
    startY: 50,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  doc.save(`${filename}-${new Date().toISOString().split("T")[0]}.pdf`);
};
