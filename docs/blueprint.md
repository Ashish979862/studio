# **App Name**: AdSpin Reward

## Core Features:

- Login & Signup: Enable users to securely login with email and password, with an optional referral code during signup. Generates unique referral code for each new user. Adds ₹5 bonus to referrer if referral code is valid.
- Dashboard: Show key info: username, email, balance, referral code and navigation actions in one place.
- Daily Check-In: Implement a 7-day calendar that rewards users for daily check-ins. Rewards Day 1–6 = ₹0.25 – ₹1; Day 7 = ₹5 or ₹10. If user skips a day → progress resets. On check-in: Add reward to wallet.
- Watch Ads: Implement an ad watching system where users earn money for viewing ads. Click ads watch button redirect ads open new tab  → show “Claim ₹0.10” button. On claim: Add ₹0.10 to wallet. User ads dekga tbhi balance add ho warna nhii ho.
- Spin and Earn: Incorporate an animated spin wheel feature that rewards users with random prizes for trying their luck. 8-segment wheel with CSS animations. Segments: ₹0.25, ₹0.5, ₹1, ₹2, ₹3, ₹5, "Better Luck Next Time", ₹0.75. Adsterra Direct Link spin pe click krte hi ad new tab Me open hoga uske bad spin kr Ske. Progressive bonuses: 20 spins: ₹2 bonus; 50 spins: ₹5 bonus; 100 spins: ₹10 bonus + 1hr cooldown.
- Withdraw Tab: Withdraw Tab, processing fee calculation and display the total, also display to users to withdraw with UPI. UPI ID input; Amount input (minimum ₹50); 5% processing fee shown; ₹100 entered → ₹5 fee → ₹95 credited. Withdraw submit hote hi balance cut ho jaye or history me pending show ho admin accept kre to aprove ya reject kre to reject btay. Or withdrawal krte hi Balance cut hoga or history me pending show hoga admin acept krte hi success hoga.
- Refer a Friend: Refer new users to gain extra earnings. On successful referral: ₹5 to the new user; ₹5 to the referrer. New user jab 50 ads dekh le tab
- Profile Tab: Show: UID; Name; Email; Your Refer Code; Copy Button for refer code; Total Earnings; Spin Count, Check-ins, Ads Watched.
- Admin Dashboard: Admin dashboard Admin login kre to Admin dashboard show ho all future Jese Ki withdraw accept reject or block unblock kisne kitna ads Dekha spin kiya online user total user all total future. Admin login AK9643270@gmail.com Pass: puchu143

## Style Guidelines:

- Primary color: Deep blue (#3F51B5), instilling a sense of trust and reliability.
- Background color: Light blue (#E3F2FD), providing a calm and clean backdrop.
- Accent color: Amber (#FFC107) as a high-contrast color for the spin wheel and call-to-action buttons, injecting vibrancy.
- Headline font: 'Poppins' (sans-serif) for titles and headings. Note: currently only Google Fonts are supported.
- Body font: 'PT Sans' (sans-serif) for body text and descriptions. Note: currently only Google Fonts are supported.
- Use flat design icons to represent each section of the app, enhancing user understanding and engagement.
- Implement subtle animations and transitions to make the app feel more alive and engaging.