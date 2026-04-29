export async function sendMail(to: string, subject: string, body: string) {
  // Stub for email service
  console.log(`Sending email to ${to}: ${subject}`);
  return { messageId: 'stub-id' };
}
