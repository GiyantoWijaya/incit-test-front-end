export default function formatDateFromUnix(timestamp: number) {
  // Convert Unix timestamp to milliseconds
  const milliseconds = timestamp * 1000;

  const date = new Date(milliseconds);

  // Format the date
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return formattedDate;
}