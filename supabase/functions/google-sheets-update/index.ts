import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface MergeRepsRequest {
  fromRepName: string;
  toRepName: string;
}

interface SheetUpdate {
  spreadsheetId: string;
  ranges: string[];
  valueInputOption: string;
  data: Array<{
    range: string;
    values: string[][];
  }>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (action === "update-password") {
      const { currentPassword, newPassword } = (await req.json()) as UpdatePasswordRequest;

      if (!currentPassword || !newPassword) {
        return new Response(
          JSON.stringify({ error: "Missing password fields" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const storedPassword = Deno.env.get("DASHBOARD_PASSWORD") || "fiberxadmin2025";

      if (currentPassword !== storedPassword) {
        return new Response(
          JSON.stringify({ error: "Current password is incorrect" }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const updateRequest = {
        data: [
          {
            range: "Config!A1",
            values: [[newPassword]],
          },
        ],
        valueInputOption: "RAW_USER_ENTRY",
      };

      const spreadsheetId = "1U3x7dtoQl9dyFzXFHWAIsBH8EOU4Tqx0Rnk8MDge7zg";
      const apiKey = Deno.env.get("GOOGLE_SHEETS_API_KEY");

      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: "Google Sheets API not configured" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateRequest),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error("Google Sheets API error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to update password in Google Sheets" }),
          {
            status: response.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Password updated successfully" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else if (action === "merge-reps") {
      const { fromRepName, toRepName } = (await req.json()) as MergeRepsRequest;

      if (!fromRepName || !toRepName) {
        return new Response(
          JSON.stringify({ error: "Missing rep names" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const spreadsheetId = "1U3x7dtoQl9dyFzXFHWAIsBH8EOU4Tqx0Rnk8MDge7zg";
      const apiKey = Deno.env.get("GOOGLE_SHEETS_API_KEY");

      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: "Google Sheets API not configured" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const sheetResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sales!B:B?key=${apiKey}`
      );

      if (!sheetResponse.ok) {
        return new Response(
          JSON.stringify({ error: "Failed to fetch sheet data" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const sheetData = await sheetResponse.json();
      const values = sheetData.values || [];

      const updateData = [];
      for (let i = 0; i < values.length; i++) {
        if (values[i] && values[i][0] === fromRepName) {
          updateData.push({
            range: `Sales!B${i + 1}`,
            values: [[toRepName]],
          });
        }
      }

      if (updateData.length === 0) {
        return new Response(
          JSON.stringify({ error: `No sales found for rep: ${fromRepName}` }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const updateRequest = {
        data: updateData,
        valueInputOption: "RAW_USER_ENTRY",
      };

      const updateResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateRequest),
        }
      );

      if (!updateResponse.ok) {
        const error = await updateResponse.text();
        console.error("Google Sheets update error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to merge sales reps" }),
          {
            status: updateResponse.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `Successfully merged ${updateData.length} sales from ${fromRepName} to ${toRepName}`,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
