import React from 'react';

export const DeleteAccountPage: React.FC = () => (
  <div className="mx-auto max-w-3xl px-5 py-12 text-[#063c2f]">
    <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">HAKKIVEDA · Account & Privacy</p>
    <h1 className="mt-3 text-3xl font-bold">Request account deletion</h1>
    <p className="mt-5 leading-7">HAKKIVEDA customers may request deletion of their customer account and associated personal information. You do not need to install the Android app to make a request.</p>
    <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
      <h2 className="text-xl font-semibold">How to request deletion</h2>
      <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7">
        <li>Send an email from your registered HAKKIVEDA account email address to <a className="font-semibold underline" href="mailto:support@hakkiveda.com?subject=HAKKIVEDA%20Account%20Deletion%20Request">support@hakkiveda.com</a> with the subject “HAKKIVEDA Account Deletion Request”.</li>
        <li>State that you want your HAKKIVEDA customer account and associated personal information deleted. Do not send your password or payment card details.</li>
        <li>We will verify account ownership before processing the request and communicate the outcome by email.</li>
      </ol>
      <p className="mt-4 text-sm text-stone-700">You can also open the HAKKIVEDA Android app, go to Account → Account & Privacy → Delete Account, and follow the available instructions.</p>
    </section>
    <section className="mt-8 space-y-3 leading-7">
      <h2 className="text-xl font-semibold">Information covered</h2>
      <p>Deletion requests cover your customer profile, saved delivery addresses and loyalty-account information. Where technically and legally applicable, associated personal information will be deleted or anonymized.</p>
      <h2 className="pt-3 text-xl font-semibold">Information that may be retained</h2>
      <p>Order invoices, payment and transaction records may need to be retained for tax, accounting, fraud prevention, dispute resolution or other legal obligations. Separately submitted hair-care questionnaires may require an additional deletion request because they may not be linked to your customer account. Any retained information will be limited to the applicable purpose and retention requirements.</p>
      <p>Retention periods depend on the applicable legal obligation and record type. Contact us for information about records associated with your request.</p>
      <h2 className="pt-3 text-xl font-semibold">Need assistance?</h2>
      <p>Email <a className="underline" href="mailto:support@hakkiveda.com">support@hakkiveda.com</a>. HAKKIVEDA Herbal Enterprises, Chikka Hunsur, Mysore 571105, Karnataka, India.</p>
    </section>
  </div>
);
