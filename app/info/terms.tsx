import InfoPage from '../../components/InfoPage';

export default function TermsScreen() {
  return (
    <InfoPage
      title="Terms of Service"
      icon="document-text-outline"
      content={`
Welcome to CavyDiet.

By using this application you agree to use it responsibly.

The application is intended to help organize guinea pig feeding schedules.

Always consult a veterinarian before making dietary decisions for your pets.
`}
    />
  );
}