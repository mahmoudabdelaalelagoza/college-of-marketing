export const events = [
  {
    dateISO: '2026-09-24',
    type: 'Open evening',
    title: 'College of Marketing open evening',
    copy: 'An introduction to our two pathways, funding and how learning applies to real marketing work.',
    time: '6:00 pm - 7:00 pm',
    location: 'Online',
    format: 'Virtual',
  },
  {
    dateISO: '2026-10-02',
    type: 'Employer briefing',
    title: 'Funding explained for employers',
    copy: 'How apprenticeship funding works, eligibility, and what it means for your team.',
    time: '1:00 pm - 1:45 pm',
    location: 'Online',
    format: 'Virtual',
  },
  {
    dateISO: '2026-10-16',
    type: 'Workshop',
    title: 'Building a measurement framework',
    copy: 'A practical session on connecting marketing activity to commercial outcomes.',
    time: '9:30 am - 12:30 pm',
    location: 'Kent',
    format: 'In person',
  },
  {
    dateISO: '2026-11-05',
    type: 'Information session',
    title: 'CIM pathway information session',
    copy: 'Understand the professional qualification route and what it adds to your career.',
    time: '5:30 pm - 6:30 pm',
    location: 'Online',
    format: 'Virtual',
  },
];

export const upcomingEvents = events.filter((event) => {
  const endOfEventDay = new Date(`${event.dateISO}T23:59:59`);
  return endOfEventDay >= new Date();
});

export const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
});

