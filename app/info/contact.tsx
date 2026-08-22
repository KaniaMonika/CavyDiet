import InfoPage from '../../components/InfoPage';

const contactContent = `
Contact CavyDiet

Questions, feedback, and bug reports are welcome.

Email

contact@test.pl

When reporting a technical problem, please include:

• A short description of the issue
• The screen where the issue occurred
• The steps required to reproduce it
• Your Android version
• Your CavyDiet application version
• A screenshot, when possible

Please do not include your password, authentication token, or other sensitive account information.

Data Requests

You may also use the support email to request:

• Information about your stored data
• Correction of inaccurate account information
• Deletion of your account and associated data

Response Time

We aim to review support messages as soon as reasonably possible.
`;

export default function ContactScreen() {
  return (
    <InfoPage
      title="Contact"
      icon="mail-outline"
      content={contactContent}
    />
  );
}
