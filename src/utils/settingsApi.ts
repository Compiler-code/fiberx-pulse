const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/google-sheets-update`;

export const updatePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${EDGE_FUNCTION_URL}?action=update-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "X-Client-Info": "supabase-js-web",
      Apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update password");
  }

  return response.json();
};

export const mergeReps = async (
  fromRepName: string,
  toRepName: string
): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${EDGE_FUNCTION_URL}?action=merge-reps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "X-Client-Info": "supabase-js-web",
      Apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ fromRepName, toRepName }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to merge reps");
  }

  return response.json();
};
