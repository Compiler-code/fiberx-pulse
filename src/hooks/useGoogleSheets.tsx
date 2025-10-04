import { useState, useEffect } from 'react';
import { SalesRecord } from '@/types/sales';

const SHEET_ID = '1U3x7dtoQl9dyFzXFHWAIsBH8EOU4Tqx0Rnk8MDge7zg';
const GID = '922166708';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

export const useGoogleSheets = () => {
  const [data, setData] = useState<SalesRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parseCSV = (csv: string): SalesRecord[] => {
    const lines = csv.split('\n');
    const records: SalesRecord[] = [];

    // Skip header row (index 0)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Parse CSV line handling quoted values
      const values: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      if (values.length >= 12) {
        const status = values[8].trim().toLowerCase();
        const record: SalesRecord = {
          timestamp: values[0],
          salesRepName: values[1],
          customerName: values[2],
          dateOfSale: values[3],
          address: values[4],
          customerPhone: values[5],
          plan: values[6],
          amountPaid: parseFloat(values[7]) || 0,
          paymentStatus: status === 'completed' || status === 'paid' ? 'Paid' : 'Pending',
          finalNotes: values[9],
          customerEmail: values[10],
          customerNIN: values[11],
        };
        records.push(record);
      }
    }

    return records;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(SHEET_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch data from Google Sheets');
      }
      
      const csvText = await response.text();
      const parsedData = parseCSV(csvText);
      setData(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching Google Sheets data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchData };
};
