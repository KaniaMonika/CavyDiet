import InfoPage from '../../components/InfoPage';

const helpContent = `

How do I create a herd?

Open the Herds section and choose the option to create a new herd. Enter the expected herd size and then add at least two guinea pigs.

How do I select the active herd?

Open the Herds screen and use the left or right arrows to select a herd. The selected herd becomes the active herd used by the Dashboard.

How do I add food?

Open the Dashboard and press Add Food.

Search for a product, select it, choose the amount in grams, and press Save.

How do I edit a food amount?

On the Dashboard, press the edit icon next to a food item.

Use the stepper buttons to change the amount and press Save.

How do I remove food?

Press the X button next to the food item and confirm the removal.

How do I view another day?

Use the left and right arrows at the top of the Dashboard.

You can also press the date or calendar icon to select a date directly.

Future dates cannot be selected.

What do the nutrition values mean?

Vitamin C, calcium, phosphorus, and sugar values are calculated from the foods and amounts recorded for the selected day.

Food database values are stored per 100 grams.

Daily Vitamin C and calcium targets are calculated using the total body weight of the guinea pigs in the active herd.

What does Ca:P mean?

Ca:P is the calcium-to-phosphorus ratio of the recorded meal.

The target range currently displayed by CavyDiet is 1.3:1 to 1.6:1.

What does High Oxalates mean?

This warning means that at least one selected product is marked as high in oxalates.

The warning does not measure the exact oxalate quantity in the complete meal.

Why was I logged out?

Authentication sessions expire for security reasons.

When your session expires, CavyDiet removes the saved session and asks you to log in again.

Is CavyDiet veterinary advice?

No.

CavyDiet is an organizational and informational tool. Always consult a qualified veterinarian before making important dietary or medical decisions for your guinea pigs.

Still need help?

Use the Contact page to report a problem or send feedback.
`;

export default function HelpScreen() {
  return (
    <InfoPage
      title="Help"
      icon="help-circle-outline"
      content={helpContent}
    />
  );
}