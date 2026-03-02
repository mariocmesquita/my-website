interface CareerEntry {
  company: string;
  role: string;
  period: string;
  intro: string;
  achievements: string[];
}

const CAREER_ENTRIES: CareerEntry[] = [
  {
    company: '42Dev',
    role: 'Co-Founder & CTO',
    period: 'aug 2023 — aug 2025',
    intro:
      'As Co-Founder, I was responsible for designing and developing technical solutions, defining technology strategies, and overseeing system development across all products.',
    achievements: [
      'Migrated production database from Firebase Firestore to MongoDB, achieving up to 85% query performance improvement.',
      'Integrated CRM with internal systems and ERP to automate the sales and post-sales flow, reducing manual effort through process automation.',
      'Led implementation of multiple product features for a training platform, including a real-time tracking system for web and mobile.',
      'Partnered with stakeholders to translate requirements into technical deliverables, delivering iterative improvements with a product mindset.',
    ],
  },
  {
    company: 'NBW Digital',
    role: 'Tech Lead',
    period: 'mar 2022 — aug 2023',
    intro:
      "As Tech Lead, I worked with my team from assessing clients' business needs to defining and developing solutions, delivering features across multiple client platforms.",
    achievements: [
      'Led development of a corporate education platform, delivering a full ecosystem (web, mobile, ERP/CRM integrations) for a market-leading company in São Paulo.',
      'Built an automated product image pipeline (background removal, normalization, multi-format export), cutting processing time from weeks to hours.',
      'Collaborated on developing a B2B e-commerce platform for selling benefits to retail suppliers.',
    ],
  },
  {
    company: 'NBW Digital',
    role: 'Mid-Level Full Stack Engineer',
    period: 'may 2021 — mar 2022',
    intro:
      'Contributed to developing and maintaining internal systems for multiple clients, adding new features, fixes, and performance improvements.',
    achievements: [
      'Improved dashboard performance and optimized PL/SQL procedures, reducing load time from minutes to under a second.',
      'Built new features to monitor and manage resources, production, and logistics.',
      'Developed and maintained integrations between internal systems and SAP products.',
      'Helped build a web platform for managing schedules and tickets, handling millions of records.',
    ],
  },
  {
    company: 'NBW Digital',
    role: 'R&D Software Engineer',
    period: 'nov 2020 — may 2021',
    intro:
      "Contributed to maintaining and improving Tasy, Philips' hospital information system, focusing on bug fixes, interface adjustments, and performance improvements.",
    achievements: [
      'Fixed bugs and adjusted the UI in the Electronic Patient Record module.',
      'Improved performance and reliability by optimizing PL/SQL functions and procedures (AngularJS, JavaScript, PL/SQL).',
    ],
  },
  {
    company: 'NBW Digital',
    role: 'Junior Full Stack Engineer',
    period: 'feb 2020 — nov 2020',
    intro:
      'Developed integrations and web applications for multiple clients across retail, e-commerce, energy, and telecom sectors, participating in every stage of the development lifecycle.',
    achievements: [],
  },
];

export function CareerSection() {
  return (
    <section id="career" className="mt-16">
      <h2 className="font-spectral font-bold text-[19px] text-foreground mb-7">Carreira</h2>

      <div className="relative">
        <div className="absolute left-[5px] top-1.5 bottom-0 w-[1.5px] bg-brand/40" />

        <div className="space-y-9">
          {CAREER_ENTRIES.map((entry) => (
            <div key={`${entry.company}-${entry.period}`} className="relative pl-8">
              <div className="absolute left-0 top-[6px] w-[11px] h-[11px] rounded-full bg-brand border-2 border-background" />

              <p className="font-sans text-[12px] text-foreground/60">{entry.period}</p>
              <p className="font-spectral font-bold text-[16px] text-foreground mt-0.5">
                {entry.role}
              </p>
              <p className="font-sans text-[11px] text-foreground/50 mt-0.5 italic">
                {entry.company}
              </p>

              <div className="mt-3 font-spectral text-[16px] text-foreground leading-[1.7] max-w-2xl space-y-1">
                <p>{entry.intro}</p>
                {entry.achievements.length > 0 && (
                  <ul className="mt-1.5 space-y-0.5 list-none">
                    {entry.achievements.map((point, i) => (
                      <li key={i}>— {point}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
