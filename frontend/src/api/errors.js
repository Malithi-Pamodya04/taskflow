// Turns an API error into a readable message for toasts.
export function getErrorMessage(error) {
  const data = error.response?.data;
  if (data?.errors?.length) return data.errors.map((e) => e.message).join('. ');
  return data?.message || 'Something went wrong. Please try again.';
}