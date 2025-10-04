import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, AlignmentType, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import { SalesRecord } from "@/types/sales";

export const generateMonthlyReport = async (salesData: SalesRecord[]) => {
  const currentDate = new Date();
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Calculate metrics
  const totalSales = salesData.length;
  const totalRevenue = salesData.reduce((sum, record) => sum + record.amountPaid, 0);
  const paidCount = salesData.filter((r) => r.paymentStatus === "Paid").length;
  const pendingCount = salesData.filter((r) => r.paymentStatus === "Pending").length;

  // Rep performance
  const repStats = salesData.reduce((acc, record) => {
    const rep = record.salesRepName;
    if (!acc[rep]) {
      acc[rep] = { sales: 0, revenue: 0 };
    }
    acc[rep].sales += 1;
    acc[rep].revenue += record.amountPaid;
    return acc;
  }, {} as Record<string, { sales: number; revenue: number }>);

  const doc = new Document({
    sections: [
      {
        children: [
          // Title
          new Paragraph({
            text: "FiberX Sales Monthly Report",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: monthName,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Summary Section
          new Paragraph({
            text: "Executive Summary",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Total Sales: ", bold: true }),
              new TextRun(totalSales.toString()),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Total Revenue: ", bold: true }),
              new TextRun(`₦${totalRevenue.toLocaleString()}`),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Paid Transactions: ", bold: true }),
              new TextRun(paidCount.toString()),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Pending Transactions: ", bold: true }),
              new TextRun(pendingCount.toString()),
            ],
            spacing: { after: 300 },
          }),

          // Sales Rep Performance
          new Paragraph({
            text: "Sales Representative Performance",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Sales Rep", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Sales", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Revenue", bold: true })] })] }),
                ],
              }),
              ...Object.entries(repStats).map(
                ([name, stats]) =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph(name)] }),
                      new TableCell({ children: [new Paragraph(stats.sales.toString())] }),
                      new TableCell({ children: [new Paragraph(`₦${stats.revenue.toLocaleString()}`)] }),
                    ],
                  })
              ),
            ],
          }),

          // Transactions Table
          new Paragraph({
            text: "Transaction Details",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Date", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Customer", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Plan", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Amount", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true })] })] }),
                ],
              }),
              ...salesData.slice(0, 50).map(
                (record) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph(new Date(record.dateOfSale).toLocaleDateString())],
                      }),
                      new TableCell({ children: [new Paragraph(record.customerName)] }),
                      new TableCell({ children: [new Paragraph(record.plan)] }),
                      new TableCell({ children: [new Paragraph(`₦${record.amountPaid.toLocaleString()}`)] }),
                      new TableCell({ children: [new Paragraph(record.paymentStatus)] }),
                    ],
                  })
              ),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `FiberX-Monthly-Report-${monthName.replace(" ", "-")}.docx`);
};
