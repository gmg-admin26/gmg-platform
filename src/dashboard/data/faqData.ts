export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: string;
  label: string;
  items: FAQItem[];
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'access',
    label: 'Access & Login',
    items: [
      {
        id: 'a1',
        question: 'How do I access Artist OS?',
        answer: 'Navigate to /login/artist-os and enter the credentials provided by your label administrator or GMG team. Artist OS has a separate login session from the internal Rocksteady dashboard. If you have not received credentials, contact your assigned label rep.',
      },
      {
        id: 'a2',
        question: 'Why am I seeing restricted access?',
        answer: 'Access across the platform is role-based. Your visible modules, pages, and actions depend on your assigned role — artist, manager, label partner, or admin. If you believe you should have access to a section that appears locked, contact your admin to review your role assignment.',
      },
      {
        id: 'a3',
        question: 'What credentials are required for demo access?',
        answer: 'Demo access uses a shared set of test credentials provided during onboarding. If you are in a demo session, a role switcher in the header lets you preview the platform from different role perspectives — artist, manager, label partner, or admin — without separate logins.',
      },
      {
        id: 'a4',
        question: 'Why can\'t I see Admin OS or other systems?',
        answer: 'Admin OS, Catalog OS, and the full Rocksteady suite are restricted to internal team members with a Rocksteady session. Artist OS is available to label partners, managers, and artists. If you need elevated access, contact the GMG platform administrator.',
      },
      {
        id: 'a5',
        question: 'How do I reset my password?',
        answer: 'Use the Forgot Password link on the login page. A reset link will be sent to your registered email within a few minutes. If you do not receive it, check your spam folder or contact platform support.',
      },
    ],
  },
  {
    id: 'artist-profile',
    label: 'Artist Profile',
    items: [
      {
        id: 'ap1',
        question: 'How do I update an artist\'s profile?',
        answer: 'Navigate to Artist OS → Roster, select the artist, and click Edit Profile or Update Info in the artist detail panel. Changes enter a review queue for admins before being applied. You will receive a notification once the update is approved or if more information is needed.',
      },
      {
        id: 'ap2',
        question: 'How do I assign an A&R Rep or Point Person?',
        answer: 'In the artist detail view, scroll to the Internal Assignment section. Click the assignment field to open a dropdown of available team members and scouts. Selecting a team member sets them as the designated point person for that artist across the platform.',
      },
      {
        id: 'ap3',
        question: 'How do I move an artist to a different label?',
        answer: 'Open the artist profile and use the Label Assignment panel to reassign them. You can remove the current label and select a new one from the available roster. This change is logged in the audit trail and may require admin confirmation depending on your role.',
      },
      {
        id: 'ap4',
        question: 'What happens when an artist is dropped?',
        answer: 'When an artist is dropped, their profile is moved to the Dropped Queue. Active roster visibility is removed, financial tracking is frozen, and campaign access is locked. All historical data — streams, revenue, campaigns — is preserved for reporting. Drops are admin-only actions and are logged with a reason and timestamp.',
      },
      {
        id: 'ap5',
        question: 'Why are some artist modules locked?',
        answer: 'Modules like Revenue, Recoupment, and Campaign OS are only available once an artist has the required data completeness and an active deal structure on file. If a module is locked, hover or click the lock icon to see what prerequisite is missing.',
      },
    ],
  },
  {
    id: 'label-management',
    label: 'Label Management',
    items: [
      {
        id: 'lm1',
        question: 'How do I create a new label?',
        answer: 'Go to Artist OS → Labels and click Create Label. Fill in the label name, slug (unique identifier), type, category, and team assignments. The slug must be lowercase, hyphen-separated, and unique across the system. Once created, you can begin assigning artists to the label roster.',
      },
      {
        id: 'lm2',
        question: 'What is the difference between Brand Imprint, Campus Label, Wellness Label, and Indie Label?',
        answer: 'Brand Imprint is used for commercial or brand-sponsored label projects. Campus Label is for university or educational music programs. Wellness Label covers health, meditation, or wellness-focused audio content. Indie Label applies to independent artist-operated labels without institutional backing. The category affects how the label appears in reporting and which templates are applied by default.',
      },
      {
        id: 'lm3',
        question: 'How do I add or remove artists from a label roster?',
        answer: 'From the Label detail page, use the Assign Artist button in the roster panel to add an artist. To remove an artist, open the artist\'s profile and change their label assignment. Artists can only belong to one active label at a time.',
      },
      {
        id: 'lm4',
        question: 'Why is an artist not appearing in a label roster?',
        answer: 'Artists only appear in a label roster after being explicitly assigned. If a newly added artist is not showing, confirm the label assignment was saved on their profile. It may also take a brief moment to reflect after a recent change — try refreshing the page.',
      },
    ],
  },
  {
    id: 'releases',
    label: 'Release OS',
    items: [
      {
        id: 'r1',
        question: 'How do I start a new release plan?',
        answer: 'In Artist OS → Releases, click New Release Plan to open the release wizard. Enter track details, artist, planned release date, and campaign parameters. The Release Date Engine will automatically suggest optimal dates based on streaming windows and competitive calendar analysis.',
      },
      {
        id: 'r2',
        question: 'Why are release dates reserved or blocked?',
        answer: 'The platform reserves certain dates based on other scheduled releases in your roster, major industry release windows, and high-traffic streaming periods. Reserved dates prevent conflicts and protect each release\'s first-week streaming potential. You can override a reserved date with admin confirmation.',
      },
      {
        id: 'r3',
        question: 'Why is submission timing important?',
        answer: 'Major streaming platforms require a minimum lead time — typically 7 to 14 days before the release date — for proper editorial pitch consideration and playlist submission. The Release Date Engine accounts for these windows and will flag if a planned date risks missing editorial deadlines.',
      },
      {
        id: 'r4',
        question: 'Why are some dates marked AI Pick or High Traffic?',
        answer: 'AI Pick dates are windows the Release Date Engine identifies as strategically optimal based on audience activity patterns, low competitor density, and editorial pitch opportunity. High Traffic dates indicate periods of elevated platform activity where visibility is higher but competition for placement is also greater.',
      },
    ],
  },
  {
    id: 'campaigns',
    label: 'Campaigns & Priority Actions',
    items: [
      {
        id: 'c1',
        question: 'How are Today\'s Priority Actions ranked?',
        answer: 'Priority Actions are ranked by a combination of urgency, signal strength, and potential revenue impact. Time-sensitive actions — like campaign approvals nearing a deadline or releases going live — are surfaced first. The AI agent continuously re-ranks actions as new signals come in throughout the day.',
      },
      {
        id: 'c2',
        question: 'What does Approve & Run do?',
        answer: 'Approve & Run confirms an AI-proposed campaign action and immediately executes it. This includes budget moves, bid adjustments, creative rotations, or new audience targeting. Once approved, the agent carries out the action and logs the outcome in the activity feed.',
      },
      {
        id: 'c3',
        question: 'What does Assisted Mode mean?',
        answer: 'Assisted Mode means the AI agent will prepare and stage campaign actions but will not execute without your explicit approval. Each proposed action is presented as a recommendation with reasoning. You review and approve or reject each one individually.',
      },
      {
        id: 'c4',
        question: 'What is Autopilot Mode?',
        answer: 'Autopilot Mode allows the AI agent to execute campaign actions autonomously within pre-set budget and performance guardrails — without requiring manual approval for each action. It is best suited for artists with established baselines and predictable campaign patterns. You can disable Autopilot at any time from the Campaign Center or the Autopilot bar.',
      },
    ],
  },
  {
    id: 'wallet',
    label: 'Wallet, Safe & Payments',
    items: [
      {
        id: 'w1',
        question: 'What is the Artist Safe / Campaign Wallet?',
        answer: 'The Artist Safe is a protected budget pool pre-authorized for AI agent use during active campaign periods. Funds deposited into the Safe can be drawn by the agent to execute approved campaign actions within set limits. The Safe balance is separate from earned royalty balances and requires an explicit funding action to replenish.',
      },
      {
        id: 'w2',
        question: 'How do ACH payouts work?',
        answer: 'Royalty distributions are batched and sent via ACH to the banking details on file for each artist. Payouts follow the distribution schedule outlined in the artist\'s deal structure — typically monthly or quarterly. ACH transfers generally settle within 2 to 3 business days of the distribution date.',
      },
      {
        id: 'w3',
        question: 'Why is payout unavailable?',
        answer: 'Payout may be unavailable if: (1) the artist\'s banking information has not been verified, (2) there is an outstanding advance balance that has not yet been fully recouped, (3) the distribution period has not yet closed, or (4) an admin hold is active on the account. Check the Recoupment tab for advance status.',
      },
      {
        id: 'w4',
        question: 'What happens when an artist is dropped but still has funds in the Safe?',
        answer: 'When an artist is dropped, any remaining Safe balance is frozen and flagged for admin review. The funds are not automatically returned or redistributed. An admin must initiate a final settlement process, which may include disbursement to the artist or reallocation per the terms of their deal agreement.',
      },
      {
        id: 'w5',
        question: 'How do I request an advance?',
        answer: 'Advances can be requested from the Artist OS → Revenue page using the Request Advance button. Fill in the requested amount, purpose, and any supporting notes. The request is submitted to your label admin for review. Advance eligibility is based on your current recoupment rate and deal terms.',
      },
      {
        id: 'w6',
        question: 'How is recoupment calculated?',
        answer: 'Recoupment is calculated as the total advances drawn minus the cumulative royalty earnings allocated back against those advances — following the recoupment rate defined in your deal structure. The Recoupment tab shows a live breakdown of your outstanding balance, recovery rate, and projected recoupment timeline.',
      },
      {
        id: 'w7',
        question: 'Why is my revenue not matching what I see on Spotify or Apple Music?',
        answer: 'DSP revenue reporting typically lags by 30 to 90 days. The revenue shown in Artist OS reflects confirmed royalty statements received and processed — not real-time stream data. Streaming numbers shown in dashboards are from API metrics, while revenue figures come from actual financial statements.',
      },
    ],
  },
  {
    id: 'catalog-os',
    label: 'Catalog OS',
    items: [
      {
        id: 'cos1',
        question: 'What is Catalog OS?',
        answer: 'Catalog OS is GMG\'s operating system for managing music catalog assets. It supports single artists, label rosters, management companies, catalog investors, and multi-entity portfolio holders. Each client gets a dedicated view showing catalog value, revenue, assets, rights, campaigns, and business entity data.',
      },
      {
        id: 'cos2',
        question: 'What client types does Catalog OS support?',
        answer: 'Catalog OS supports: Individual Artists (single catalog view), Management Companies (artist roster view), Labels — major or independent (label-level catalog view), Catalog Owners and Buyers (portfolio investment view), Distributors using GMG services, and Multi-Entity holding companies managing multiple rosters.',
      },
      {
        id: 'cos3',
        question: 'How do I switch between catalog clients?',
        answer: 'Use the client switcher in the Catalog OS sidebar. Click the client name to open a dropdown listing all active clients you have access to. Selecting a client loads their catalog context across all Catalog OS pages without requiring a page reload.',
      },
      {
        id: 'cos4',
        question: 'What does Est. Catalog Value mean?',
        answer: 'Est. Catalog Value is the estimated fair market value of the music catalog based on a Net Music Value (NMV) multiple applied to trailing 12-month royalty income. The multiple used is disclosed in the Catalog Value page. This is an estimate for planning purposes — not a binding valuation.',
      },
      {
        id: 'cos5',
        question: 'How is the Revenue Multiple calculated?',
        answer: 'The Revenue Multiple (e.g., 34×) represents the ratio of estimated catalog value to trailing 12-month net music value. Higher multiples typically indicate strong growth trajectory, sync activity, or brand premium. The Catalog Value page breaks down the multiple components and compares against current market averages.',
      },
      {
        id: 'cos6',
        question: 'What is the Roster view in Catalog OS?',
        answer: 'The Roster view appears for multi-artist clients — labels, management companies, and portfolio holders. It shows all artists in the client\'s catalog, their individual values, monthly revenues, annual yield, roles (owned, managed, acquired, licensed), and status. Single-artist clients do not see this view.',
      },
      {
        id: 'cos7',
        question: 'What does the Sale Room page show?',
        answer: 'The Sale Room is a confidential section showing catalog valuation, buyer deal flow, diligence status, investment narrative, and GMG\'s hold or sell recommendation. It is only shown when the catalog has an active sale evaluation in progress. When not for sale, the section displays a locked status.',
      },
      {
        id: 'cos8',
        question: 'How often is catalog data updated?',
        answer: 'Catalog data is updated on a rolling basis as new royalty statements, streaming reports, and sync activity come in. The last update timestamp is shown in the Catalog OS Overview header. For time-sensitive valuations or due diligence, contact your GMG catalog rep for a real-time data pull.',
      },
    ],
  },
  {
    id: 'admin-os',
    label: 'Admin OS',
    items: [
      {
        id: 'ao1',
        question: 'What is Admin OS?',
        answer: 'Admin OS is the executive operations command center for the GMG internal team. It provides a real-time view of roster health, deal pipeline, AI agent status, financial operations, team performance, partner activity, and global signal monitoring. Access is restricted to GMG internal team members.',
      },
      {
        id: 'ao2',
        question: 'Who has access to Admin OS?',
        answer: 'Admin OS requires a Rocksteady internal session — meaning the user must be authenticated through the Rocksteady executive login, not the Artist OS artist/label login. If you are an external partner, label, or artist, you will not have access to Admin OS.',
      },
      {
        id: 'ao3',
        question: 'What does the Exec Summary Strip show?',
        answer: 'The Exec Summary Strip at the top of Admin OS provides a live high-level pulse — active roster size, active campaigns, open tasks, weekly revenue, and any critical alerts requiring immediate attention. It refreshes in real time and is the first thing to check when opening the dashboard.',
      },
      {
        id: 'ao4',
        question: 'What is the Global Signal Monitor?',
        answer: 'The Global Signal Monitor displays live signals across all artists, labels, and territories being tracked by GMG AI agents — including streaming velocity spikes, viral social moments, sync leads, and emerging artist signals. Signals are ranked by significance and can be filtered by type, geography, or artist.',
      },
      {
        id: 'ao5',
        question: 'What does the Deal Pipeline track?',
        answer: 'The Deal Pipeline in Admin OS tracks all active commercial conversations — new artist signings, catalog acquisitions, partnership negotiations, and licensing deals. Each deal is staged (prospecting, in discussion, in diligence, closed, declined) and assigned to a team member for follow-up.',
      },
    ],
  },
  {
    id: 'rocksteady',
    label: 'Rocksteady A&R',
    items: [
      {
        id: 'rs1',
        question: 'What is Rocksteady?',
        answer: 'Rocksteady is GMG\'s AI-powered A&R intelligence engine. It continuously scans music platforms, social signals, streaming data, and cultural indicators to identify emerging artists and high-momentum catalogs before they become obvious. Rocksteady feeds discovery intelligence to the internal deal pipeline.',
      },
      {
        id: 'rs2',
        question: 'What is a Rocksteady Alert?',
        answer: 'Rocksteady Alerts are triggered when an artist or catalog crosses a significant signal threshold — such as a sudden streaming spike, viral social momentum, a notable sync placement, or a rapid increase in saves. Alerts are color-coded by urgency: red for breaking, yellow for rising, and gray for watch-list signals.',
      },
      {
        id: 'rs3',
        question: 'What does the Paragon Report show?',
        answer: 'The Paragon Report is a curated weekly summary of the most significant A&R discoveries and signal events. It is generated by aggregating the week\'s highest-quality signals and ranking them by a composite score of velocity, cultural fit, and deal potential. The report is the primary briefing document for A&R review meetings.',
      },
      {
        id: 'rs4',
        question: 'How are AI Scouts different from human scouts?',
        answer: 'AI Scouts are automated signal-monitoring agents that track artist and catalog signals 24/7 across DSPs, social platforms, and cultural feeds. Human scouts focus on qualitative discovery — attending shows, building relationships, and applying cultural judgment. AI Scouts amplify human scout bandwidth by surfacing data-backed leads for follow-up.',
      },
      {
        id: 'rs5',
        question: 'What is the Culture Map?',
        answer: 'The Culture Map is a geographic visualization of music signal density and cultural momentum by city, region, and territory. It shows where new genre movements are forming, where streaming volume is growing fastest, and which markets are underrepresented in GMG\'s current roster — helping target discovery and partnership efforts.',
      },
    ],
  },
  {
    id: 'tasks-workflow',
    label: 'Tasks & Workflow',
    items: [
      {
        id: 'tw1',
        question: 'How do tasks work across the platform?',
        answer: 'Tasks are action items that can be created, assigned, and tracked across all major platform views — Artist OS, Catalog OS, Admin OS, and Rocksteady. Each task has an owner, priority, due date, status, and category. Tasks can be submitted from any dashboard using the Submit Task button in the task widget.',
      },
      {
        id: 'tw2',
        question: 'Who can see and action tasks?',
        answer: 'Task visibility is role-dependent. Artists and managers see tasks related to their catalog or roster. Label partners see tasks relevant to their imprint. Admin users can see all tasks across all clients. Task assignment determines who receives the action notification.',
      },
      {
        id: 'tw3',
        question: 'What is Team Progress?',
        answer: 'The Team Progress view tracks the completion rate of tasks and milestones across active client engagements. It shows progress by week, responsible team member, and category. It is used in weekly ops reviews and client check-ins to demonstrate forward momentum.',
      },
      {
        id: 'tw4',
        question: 'How do I flag a task as critical?',
        answer: 'When creating or editing a task, select Critical from the priority dropdown. Critical tasks trigger an immediate notification to the assigned team member and appear at the top of all task views with a red priority indicator. Use Critical sparingly — it is intended for items that block revenue or deal outcomes.',
      },
      {
        id: 'tw5',
        question: 'What is the 12-Month Operating Plan?',
        answer: 'The 12-Month Operating Plan in Catalog OS is a visual roadmap showing all planned campaigns, releases, milestones, and revenue projections over a rolling 12-month window. It is updated as new initiatives are approved and serves as the primary planning reference for catalog management check-ins.',
      },
    ],
  },
  {
    id: 'dropped',
    label: 'Dropped Artists',
    items: [
      {
        id: 'd1',
        question: 'What does Dropped status mean?',
        answer: 'Dropped status indicates that an artist\'s active deal with the label has ended and they have been removed from the working roster. All platform features are locked to prevent new activity. Historical data — revenue, streams, campaigns, and milestones — is fully preserved for audit and reporting purposes.',
      },
      {
        id: 'd2',
        question: 'Why are features locked after an artist is dropped?',
        answer: 'Feature locking is a protective measure. Once an artist is dropped, no new campaigns, releases, or financial activity should be initiated against their profile. The lock prevents accidental spend or data changes after the deal has ended.',
      },
      {
        id: 'd3',
        question: 'Where do dropped artists go?',
        answer: 'Dropped artists are moved to the Dropped Queue, accessible via Artist OS for admin users. The Dropped Queue shows the full history of dropped artists, drop dates, reasons logged, and financial settlement status.',
      },
      {
        id: 'd4',
        question: 'How is final payment and metadata transfer handled?',
        answer: 'Final payment and metadata transfer are handled as part of the offboarding process initiated by an admin. This includes confirming any outstanding advance recoupment, initiating a final ACH distribution if applicable, and flagging the artist record for metadata rights transfer based on the deal terms.',
      },
    ],
  },
  {
    id: 'roster-intelligence',
    label: 'Roster Intelligence',
    items: [
      {
        id: 'ri1',
        question: 'What do Health Score and warnings mean?',
        answer: 'Health Score is a 0–100 composite score reflecting the operational completeness and activity level of an artist record. It factors in data quality, release cadence, audience growth trends, and financial standing. A yellow or red Health Score indicates something is missing or declining — hover the score to see the contributing factors.',
      },
      {
        id: 'ri2',
        question: 'Why is an artist flagged At Risk?',
        answer: 'At Risk flags are triggered when multiple negative signals are detected simultaneously — for example: declining streaming velocity, a missed release window, a low data quality score, or a lapsing campaign. At Risk does not mean dropped; it is a signal to take action before performance deteriorates further.',
      },
      {
        id: 'ri3',
        question: 'What data issues block full roster readiness?',
        answer: 'Common blockers include: missing Spotify URI or Apple Music ID, no social handles linked, an incomplete deal structure on file, missing genre tags, or no releases within the last 12 months. The Roster Readiness page provides a per-artist breakdown of what is blocking a complete record.',
      },
    ],
  },
  {
    id: 'scouts',
    label: 'AI Scouts & Rocksteady',
    items: [
      {
        id: 's1',
        question: 'What do AI Scouts do?',
        answer: 'AI Scouts are autonomous signal-monitoring agents assigned to track specific artist profiles, territories, or music niches. They surface streaming velocity changes, social momentum spikes, playlist additions, and emerging cultural signals — feeding discovery intelligence directly into Rocksteady A&R.',
      },
      {
        id: 's2',
        question: 'How are scout ranks organized?',
        answer: 'Scouts are ranked by discovery accuracy and signal quality over time. Ranks range from Scout to Senior Scout to Lead Scout and Regional Director. Higher-ranked scouts have access to broader signal networks and can be assigned as primary operators on label accounts or key artist rosters.',
      },
      {
        id: 's3',
        question: 'Why are scouts assignable as operators or point people?',
        answer: 'Assigning a scout as an operator gives them elevated access to manage the artist\'s Rocksteady profile — reviewing signals, updating discovery notes, and coordinating with label A&R. Assigning as a point person sets them as the primary contact for that artist\'s discovery workflow without full operator access.',
      },
      {
        id: 's4',
        question: 'What does "Live Signals Detected" mean?',
        answer: 'Live Signals Detected indicates that the Rocksteady engine has detected one or more real-time momentum signals for that artist — such as a rapid increase in saves, a viral social post, a new sync placement, or a spike in playlist adds. These signals are time-sensitive and typically trigger a Priority Action recommendation.',
      },
    ],
  },
  {
    id: 'troubleshooting',
    label: 'Bugs & Troubleshooting',
    items: [
      {
        id: 't1',
        question: 'Why didn\'t my save stick?',
        answer: 'If a save appeared to complete but the data reverted, it is likely due to a validation error or a brief network interruption during submission. Check that all required fields are filled, then try saving again. If the issue persists, use the Report Bug button to submit a report with the page name and what you were trying to save.',
      },
      {
        id: 't2',
        question: 'Why is a label not appearing after creation?',
        answer: 'After creating a label, it should appear immediately in the Labels list. If it does not, try a hard refresh (Cmd+Shift+R or Ctrl+Shift+R). If the label is still missing after a refresh, the creation may not have completed — try creating it again and confirm the success message appears before navigating away.',
      },
      {
        id: 't3',
        question: 'Why is an artist still showing in an active roster after being dropped?',
        answer: 'This is typically a display caching issue. Perform a hard refresh on the roster page. If the artist still shows as active after refreshing, submit a bug report — include the artist name, the label roster where they appear, and the date they were dropped.',
      },
      {
        id: 't4',
        question: 'How do I report a bug?',
        answer: 'Click the HELP button in the top header bar on any page and select Report Bug. You can also click the floating support button in the bottom-right corner of any dashboard view. The form auto-fills the current page context. Select severity, category, write a brief summary, and submit — the team is notified immediately.',
      },
      {
        id: 't5',
        question: 'Data is loading slowly or showing zeros.',
        answer: 'Slow data loads are usually caused by a large query or a brief platform sync delay. Wait 15–30 seconds and reload the page. If metrics are showing zero when they should not be, the underlying data source may still be indexing — check back in a few minutes. If the issue persists across multiple sessions, report it as a bug with the specific module and metric name.',
      },
      {
        id: 't6',
        question: 'A modal or panel will not close.',
        answer: 'Press the Escape key to dismiss most modals and slide-over panels. If that does not work, click outside the panel area (on the dark overlay). If neither method works, refresh the page — most form state is preserved. Report the issue if it happens consistently on a specific page.',
      },
    ],
  },
];
