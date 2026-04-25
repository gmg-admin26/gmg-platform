// Site-wide config for Chef Cheryl's cooking classes.
// Toggle enrollmentOpen to switch between "Reserve Your Spot" and "Enroll + PayPal" flows.

export const ENROLLMENT_OPEN = false; // Set to true on/after May 1, 2026

export const ENROLLMENT_OPEN_DATE = 'May 1, 2026';
export const PROGRAM_START = 'June 15, 2026';
export const PROGRAM_WEEKS = 8;
export const PRICE_PER_WEEK = 300;

export const WEEKS = [
  { id: 'week1', label: 'Week 1', dates: 'June 15–19, 2026'    },
  { id: 'week2', label: 'Week 2', dates: 'June 22–26, 2026'    },
  { id: 'week3', label: 'Week 3', dates: 'June 29 – July 3, 2026' },
  { id: 'week4', label: 'Week 4', dates: 'July 6–10, 2026'     },
  { id: 'week5', label: 'Week 5', dates: 'July 13–17, 2026'    },
  { id: 'week6', label: 'Week 6', dates: 'July 20–24, 2026'    },
  { id: 'week7', label: 'Week 7', dates: 'July 27–31, 2026'    },
  { id: 'week8', label: 'Week 8', dates: 'August 3–7, 2026'    },
];

export const SESSIONS = [
  { id: 'morning',   label: 'Morning',   time: '9:00 AM – 12:30 PM' },
  { id: 'afternoon', label: 'Afternoon', time: '1:00 PM – 4:00 PM'  },
];
