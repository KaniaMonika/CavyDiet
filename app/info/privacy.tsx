import InfoPage from '../../components/InfoPage';

const privacyContent = `
Last updated: July 2026

1. Introduction

CavyDiet is an application designed to help users organize and monitor guinea pig feeding.

This Privacy Policy explains what information may be collected, how it is used, and how it is protected.

2. Information We Collect

When you create an account, CavyDiet may collect:

• Username
• Email address
• Encrypted password information

The application may also store information entered by you, including:

• Herd information
• Guinea pig names, sex, and weight
• Feeding dates
• Selected foods
• Food amounts
• Calculated nutrition summaries

3. How We Use Information

The collected information is used to:

• Create and manage your account
• Authenticate your access to the application
• Store your herds and guinea pig profiles
• Record feeding history
• Calculate nutrition summaries
• Provide the core functionality of CavyDiet

4. Authentication and Local Storage

CavyDiet uses an authentication token to keep you signed in.

Passwords are not stored in plain text by the CavyDiet backend.

5. Data Sharing

CavyDiet does not sell user information.

6. Data Retention

Account and feeding information may be retained while your account remains active.

7. Data Security

Reasonable technical measures are used to protect user information, including password hashing and authenticated access to protected application data.

However, no electronic storage or transmission method can guarantee complete security.

8. Children's Privacy

CavyDiet is not specifically designed to collect personal information from children.

A parent or legal guardian should supervise use of the application by minors.

9. Veterinary Disclaimer

CavyDiet provides organizational and informational tools only.

Nutrition summaries and recommendations are not a substitute for advice, diagnosis, or treatment provided by a qualified veterinarian.

10. Changes to This Policy

This Privacy Policy may be updated as the application develops.

The current version and its effective date will be displayed on this page.

11. Contact

For privacy questions or data deletion requests, use the details available on the Contact page.
`;

export default function PrivacyScreen() {
  return (
    <InfoPage
      title="Privacy Policy"
      icon="shield-checkmark-outline"
      content={privacyContent}
    />
  );
}
