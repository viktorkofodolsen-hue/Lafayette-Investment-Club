// Seeds the lafayette-ic dataset with the content currently live on the
// static HTML site, so the Studio isn't empty on first login.
//
// Run with:
//   npx sanity exec scripts/seed.js --with-user-token
//
// Safe to re-run: every document uses a fixed _id and createOrReplace(),
// so re-running just overwrites the same 11 documents with the same data.
import {getCliClient} from 'sanity/cli'
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const siteRoot = path.resolve(__dirname, '..', '..') // studio/scripts -> site root

const client = getCliClient({apiVersion: '2026-02-01'})

// ---------- small helpers ----------

function key() {
  return Math.random().toString(36).slice(2, 10)
}

function span(text, marks = []) {
  return {_type: 'span', _key: key(), text, marks}
}

function blk(children, opts = {}) {
  return {
    _type: 'block',
    _key: key(),
    style: opts.style || 'normal',
    ...(opts.listItem ? {listItem: opts.listItem, level: opts.level || 1} : {}),
    markDefs: opts.markDefs || [],
    children,
  }
}

function p(text) {
  return blk([span(text)])
}

function li(text) {
  return blk([span(text)], {listItem: 'bullet'})
}

// Builds a paragraph/list-item from mixed plain + linked + bold segments.
// segments: [{text}, {text, href}, {text, bold}]
function rich(segments, opts = {}) {
  const markDefs = []
  const children = segments.map((seg) => {
    if (seg.href) {
      const linkKey = key()
      markDefs.push({_type: 'link', _key: linkKey, href: seg.href})
      return span(seg.text, [linkKey])
    }
    return span(seg.text, seg.bold ? ['strong'] : [])
  })
  return blk(children, {...opts, markDefs})
}

async function uploadImage(relPath, altText) {
  const filePath = path.join(siteRoot, relPath)
  console.log(`  uploading image: ${relPath}`)
  const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
    filename: path.basename(filePath),
  })
  return {
    _type: 'image',
    asset: {_type: 'reference', _ref: asset._id},
    ...(altText ? {alt: altText} : {}),
  }
}

async function uploadFile(relPath) {
  const filePath = path.join(siteRoot, relPath)
  console.log(`  uploading file: ${relPath}`)
  const asset = await client.assets.upload('file', fs.createReadStream(filePath), {
    filename: path.basename(filePath),
  })
  return {_type: 'file', asset: {_type: 'reference', _ref: asset._id}}
}

function sector(sector, percentage) {
  return {_type: 'sectorWeight', _key: key(), sector, percentage}
}

function stat(label, value, decimals, prefix, suffix) {
  return {_type: 'statFigure', _key: key(), label, value, decimals, prefix, suffix}
}

function linkItem(label, url) {
  return {_type: 'linkItem', _key: key(), label, url}
}

async function boardMember(name, role, photoPath) {
  return {
    _type: 'boardMember',
    _key: key(),
    name,
    role,
    photo: await uploadImage(`assets/board/${photoPath}`, name),
  }
}

async function archiveEntry(label, filePath) {
  return {
    _type: 'archiveEntry',
    _key: key(),
    label,
    file: await uploadFile(`assets/portfolios/${filePath}`),
  }
}

function placement(name, description) {
  return {_type: 'placementCompany', _key: key(), name, description}
}

function pitchStep(title, body) {
  return {_type: 'pitchStep', _key: key(), title, body}
}

function coPresident(name, email, classYear) {
  return {_type: 'coPresident', _key: key(), name, email, classYear}
}

function infoBlock(title, body) {
  return {_type: 'infoBlock', _key: key(), title, body}
}

const FOOTER_DISCLAIMER =
  'The members of the Lafayette College Investment Club are not professional financial advisors, all investment ideas expressed are our own opinions. The Lafayette College Investment Club uses this website as an informational resource and learning tool for Lafayette students interested in finance and the stock market. Investing can result in a full loss of investment. The purpose of this website and club is not to provide investment advice.'

async function seed() {
  console.log('Site Settings...')
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: 'Lafayette Investment Club',
    establishedLabel: 'Est. 1946',
    logo: await uploadImage('assets/logo.jpg', 'Lafayette Investment Club crest'),
    instagramUrl: 'https://www.instagram.com/investmentclublaf/',
    linkedinUrl: 'https://www.linkedin.com/company/the-lafayette-investment-club/posts/?feedView=all',
    weeklyMeetingLocation: 'Moskow Room, William E. Simon Center for Economics and Business',
    weeklyMeetingTime: 'Fridays, 12:15 PM',
    weeklyMeetingFoodNote: 'Provided by the club',
    executiveBoardMeetingNote: 'Fridays, following the general meeting — Simon Conference Room',
    coPresidents: [
      coPresident('Valdemar Kofod-Olsen', 'kofodolv@lafayette.edu', "'26"),
      coPresident('Kathryn Duane', 'duanek@lafayette.edu', "'26"),
    ],
    pitchProcessSteps: [
      pitchStep(
        'Reach out and get on the schedule',
        "Tell a member of the executive team you'd like to pitch a buy or sell, or present a market update or educational segment. You'll be paired with others presenting that same week.",
      ),
      pitchStep(
        'Present at the weekly meeting',
        'Prepare your presentation and pitch it to the club. Members vote anonymously on whether the club buys or sells the stock.',
      ),
      pitchStep(
        'Apply for a position',
        "Once you've given two presentations and hold over 50% attendance, you're eligible to apply. Elections for every position run at the end of each semester.",
      ),
    ],
    footerDisclaimer: FOOTER_DISCLAIMER,
    copyrightYear: 2026,
  })

  console.log('Home Page...')
  await client.createOrReplace({
    _id: 'homePage',
    _type: 'homePage',
    heroEyebrow: 'Lafayette College · Founded 1946',
    heroHeadline: "The nation's oldest student-run investment club.",
    heroSubheading:
      'Since 1946, Lafayette students have researched, pitched, and managed a real portfolio — building analytical skill and investment judgment they carry straight into careers on the Street.',
    heroPrimaryCtaLabel: 'About the Club',
    heroPrimaryCtaLink: '#about',
    heroSecondaryCtaLabel: 'View Portfolio Performance',
    heroSecondaryCtaLink: '#portfolio',
    heroVideo: await uploadFile('assets/bull-animation.mp4'),
    heroPosterImage: await uploadImage(
      'assets/logo.jpg',
      "Lafayette Investment Club crest, featuring the club's bull emblem",
    ),
    aboutBody: [
      p(
        'Founded in 1946, the Lafayette Investment Club stands as one of the oldest student-managed investment organizations in the United States. What began as a $3,000 student portfolio has since grown to over $1.4 million in assets under management, reflecting more than seven decades of disciplined investing and student leadership.',
      ),
      p(
        'Our mission is to provide Lafayette students with a hands-on education in financial markets, equity research, and portfolio management. Through weekly meetings, members learn to analyze companies, build financial models, and pitch investment ideas grounded in fundamental research. The Club is entirely student-run, allowing members to gain real-world experience in making investment decisions and managing a live portfolio.',
      ),
      p(
        "We welcome students of all majors, career interests, and backgrounds who share a curiosity for markets and a drive to learn. Whether you're exploring finance for the first time or preparing for a career in investment management, the Lafayette Investment Club offers a platform to develop analytical skills, investment judgment, and professional confidence, all within a collaborative and intellectually rigorous environment.",
      ),
    ],
    stats: [
      stat('Assets Under Management', 1.6, 1, '$', 'M+'),
      stat('Active Members', 320, 0, '', '+'),
      stat('Alumni', 750, 0, '', '+'),
      stat('Investors', 50, 0, '', '+'),
    ],
    performanceEyebrow: 'Performance',
    performanceHeading: 'Benchmarked, not just back-tested.',
    performanceLede:
      "Every dollar in the club's portfolio has been on the tape since May 13, 2024. We track our return against the S&P 500, the Nasdaq, the Dow Jones Industrial Average, and the Russell 2000 — and members see all four, not just the ones we're beating.",
    inceptionDate: '2024-05-13',
    returnSinceInception: 'More than +30%',
    benchmarksTracked: 'S&P 500 · Nasdaq · Dow Jones Industrial Average · Russell 2000',
    performanceChartImage: await uploadImage(
      'assets/performance.png',
      "Line chart comparing the club portfolio's return to the S&P 500, Nasdaq, Dow Jones Industrial Average, and Russell 2000 from May 2024 to the present.",
    ),
    performanceChartCaption: 'Club portfolio return vs. major indices, since inception.',
    sectorsEyebrow: 'Allocation',
    sectorsHeading: 'Sector Allocation.',
    sectorsLede:
      'Each sector has its own dedicated analyst, responsible for researching, tracking, and pitching ideas within that space.',
    sectorsChartImage: await uploadImage(
      'assets/sector-allocation.png',
      "Pie chart of the club portfolio's sector allocation across eleven GICS sectors.",
    ),
    sectorsChartCaption: 'Current sector allocation, by weight of portfolio.',
    sectors: [
      sector('Industrials', 20.7),
      sector('Financials', 19.0),
      sector('Information Technology', 15.3),
      sector('Health Care', 10.2),
      sector('Consumer Discretionary', 8.7),
      sector('Cash & Cash Equivalents', 6.3),
      sector('Communication Services', 5.4),
      sector('Materials', 4.2),
      sector('Utilities', 4.1),
      sector('Consumer Staples', 3.2),
      sector('Energy', 2.2),
    ],
    sectorsFootnote: 'Cash & cash equivalents reflect capital awaiting Investment Committee approval.',
    membersEyebrow: 'Members',
    membersHeading: 'From pitch to position.',
    contactEyebrow: 'Contact',
    contactHeading: 'Get in touch.',
  })

  console.log('What We Do Page...')
  await client.createOrReplace({
    _id: 'whatWeDoPage',
    _type: 'whatWeDoPage',
    pageHeader: {
      _type: 'pageHeader',
      eyebrow: 'About',
      title: 'What We Do',
      lede: 'Real-world investing experience for Lafayette students, since 1946.',
    },
    body: [
      rich([
        {
          text: 'The Lafayette Investment Club is an educational resource offering real-world experience to Lafayette students interested in the world of investing. Starting in 1946 with $3,000, it is the oldest student-run investment club in America, currently managing a portfolio worth over $1,000,000. ',
        },
        {text: '(See more at CNN Money Article.)'},
        {
          text: ' With backgrounds ranging from "no experience, but I want to learn" to "I manage a personal portfolio," this investment club is ideal for anyone interested in learning how to make (or lose) money.',
        },
      ]),
      p(
        'We strive to educate members on the investing process by creating presentations on helpful concepts and investing in real assets. Our funds are available to test our own ideas and learn from our decisions. The club organizes trips to Wall Street, brings in informative speakers, and supports various activities to encourage student development. While the Executive Board sets the agenda for weekly meetings, the Club relies on the input and participation of all of its members. Unless emergency action is required, all decisions by the Lafayette Investment Club are voted on during Friday meetings by its students.',
      ),
      p(
        'Our portfolio consists of an assortment of securities with the majority being equity-based. Other than domestic stocks and mutual funds, the Investment Club also invests internationally, currently holding an emerging markets exchange-traded fund. In addition, the club also owns bonds and holds a percentage of the portfolio in cash, which is used to buy new assets and to fund the club\'s annual field trip to Wall Street.',
      ),
      p(
        'The Investment Club meets on Fridays at 12:15 pm during lunch in the Moskow Room of the Simon Center for Economics and Business. Free pizza and soda are always provided for members in attendance. Meetings typically involve an update on the current market, proposals to buy or sell securities, informative presentations, or guest speakers brought in to either educate members in their area of expertise or discuss possible job and internship opportunities.',
      ),
      p(
        'Whether you actively participate in making proposals, or just come to learn the fundamentals of investing, you can always count on walking away with having learned at least one thing that will allow you to make money in the future.',
      ),
    ],
  })

  console.log('Club Structure Page...')
  await client.createOrReplace({
    _id: 'clubStructurePage',
    _type: 'clubStructurePage',
    pageHeader: {
      _type: 'pageHeader',
      eyebrow: 'About',
      title: 'Club Structure',
      lede: 'The Lafayette College Investment Club is made up of two groups: the Executive Board and the general members.',
    },
    introBody: [
      p(
        "Every spring the Club holds elections and the Executive Board is voted on by the members. In order to be considered for a position, the prospective Club member must regularly attend meetings and consistently participate in the Club's operations, including participating in two presentations to be considered for that semester's election.",
      ),
    ],
    generalMembersDescription:
      'Attend meetings, present market updates, pitch investment opportunities, and vote on buy/sell pitches.',
    officerPositions: [
      'Co-Presidents',
      'Vice President',
      'Chairman of the Board',
      'Treasurer',
      'Marketing Director',
      'Head of Research',
      'Head Analyst',
      'ESG/Risk Analyst',
      'Industrials Analyst',
      'Consumer Spending Analyst',
      'Healthcare Analyst',
      'Financials Analyst',
      'Energy Analyst',
      'TMT Analyst',
    ],
  })

  console.log('ESG Commitment Page...')
  await client.createOrReplace({
    _id: 'esgCommitmentPage',
    _type: 'esgCommitmentPage',
    pageHeader: {
      _type: 'pageHeader',
      eyebrow: 'About',
      title: "The Lafayette College Investment Club's Commitment to ESG",
      lede: "As the nation's oldest student-run investment club, we believe we have a responsibility to support and adopt sustainability, morality, and justice in our portfolio and beyond.",
    },
    introBody: [
      p(
        'The Lafayette College Investment Club, in an effort to adopt modern investing standards, has voted to approve an Environmental, Social, and Corporate Governance (ESG) commitment for the portfolio moving forward.',
      ),
      p(
        'Since 1946, with a principal investment of $3,000, the Club has grown in value to over $1,000,000 this year. The Club believes that with its substantial capital position, and the rapidly growing opportunities to invest in ESG friendly companies, there is no justification for sacrificing morally just practices for profits.',
      ),
      p('The Club views ESG investing as a holistic approach in evaluating how companies go about their operations:'),
    ],
    pillars: [
      infoBlock('Environmental', [
        p(
          "Suitable companies will be those who have efforts in place to address issues related to today's climate crisis. These companies are also rated on their ability to avoid depleting the already diminishing raw materials in the world, creating operations that provide sustainability long-term. While many may treat ESG as synonymous with sustainable investing, the definition is actually much broader.",
        ),
      ]),
      infoBlock('Social', [
        p(
          'ESG analysis focuses on how companies foster diversity in the workplace, relying heavily on inclusivity in the recruiting process. It also focuses on the rights of workers throughout the entire supply chain, and on providing ample consumer protection at the final stages.',
        ),
      ]),
      infoBlock('Corporate Governance', [
        p(
          "Corporate governance looks inward upon the company's structure. Is there an ample balance between the power of the CEO and Board of Directors? Are employees receiving equitable rates of compensation in comparison to their executives? These are the values and questions the Club will refer to in every investment decision moving forward.",
        ),
      ]),
    ],
    closingBody: [
      p(
        'In order to provide the Club with quantitative measures to track its progression in meeting these goals, we will refer primarily to MSCI ratings. MSCI is a public company that provides investors with published analysis on other companies\' ability to meet ESG standards. Ultimately, companies are rated on a CCC to AAA scale.',
      ),
      p("We are excited for this new phase in the Club's history and look forward to updating you all on our progress in the near future!"),
    ],
    signatureLine: 'Sincerely,\nThe Members of The Lafayette College Investment Club',
  })

  console.log('Executive Board Page (16 photos to upload — this takes a moment)...')
  await client.createOrReplace({
    _id: 'executiveBoardPage',
    _type: 'executiveBoardPage',
    pageHeader: {
      _type: 'pageHeader',
      eyebrow: 'Leadership',
      title: 'Executive Board',
      lede: "Meet the students who lead the club's committee, analyst teams, and daily operations.",
    },
    members: await Promise.all([
      boardMember('Valdemar Kofod-Olsen', 'Co-President', 'valdemar-kofod-olsen.avif'),
      boardMember('Kathryn Duane', 'Co-President', 'kathryn-duane.avif'),
      boardMember('Hasnat Aslam', 'Vice President', 'hasnat-aslam.avif'),
      boardMember('Lorenzo Marsili', 'Head Analyst', 'lorenzo-marsili.avif'),
      boardMember('Hudson Pace', 'Treasurer', 'hudson-pace.avif'),
      boardMember('James Spiegel', 'Healthcare Analyst', 'james-spiegel.avif'),
      boardMember('Paras Breigel', 'Consumer Spending Analyst', 'paras-breigel.avif'),
      boardMember('Tyler Mahaffey', 'Energy Analyst', 'tyler-mahaffey.avif'),
      boardMember('Aidan Mahaffey', 'TMT Analyst', 'aidan-mahaffey.avif'),
      boardMember('Eric Wang', 'Fixed Income Analyst', 'eric-wang.avif'),
      boardMember('Max Fujimori', 'Materials Analyst', 'max-fujimori.avif'),
      boardMember('Dan Colden', 'Risk Analyst', 'dan-colden.avif'),
      boardMember('Ozzie Shenk', 'Head of Trade Execution', 'ozzie-shenk.avif'),
      boardMember('Charles Taliano', 'PR Chair', 'charles-taliano.avif'),
      boardMember('Jacqueline Ryan', 'PR Chair', 'jacqueline-ryan.avif'),
      boardMember('Michael Kelly', 'Faculty Advisor', 'michael-kelly.jpg'),
    ]),
    closingNote: [
      rich([
        {text: 'Every officer position is re-elected at the end of each semester. See '},
        {text: 'How to Pitch a Stock', href: 'how-to-pitch-a-stock.html'},
        {text: ' for the path to joining a coverage team.'},
      ]),
    ],
  })

  console.log('Our Portfolio Page (12 archive files to upload)...')
  await client.createOrReplace({
    _id: 'ourPortfolioPage',
    _type: 'ourPortfolioPage',
    pageHeader: {
      _type: 'pageHeader',
      eyebrow: 'Portfolio',
      title: 'Our Portfolio',
      lede: 'Our target allocation, live holdings, top performers, and a full archive of past portfolios.',
    },
    targetEyebrow: 'Target Allocation',
    targetHeading: 'Where we aim to be.',
    targetLede:
      "This is the Club's target sector allocation — the mix we manage toward over time, distinct from the actual holdings on any given day.",
    targetChartImage: await uploadImage(
      'assets/target-sector-allocation.png',
      "Pie chart of the club's target sector allocation across eleven sectors.",
    ),
    targetSectors: [
      sector('Tech', 15.0),
      sector('Healthcare', 15.0),
      sector('Financials', 15.0),
      sector('Industrials', 10.0),
      sector('Consumer C', 10.0),
      sector('Cash + Bonds', 10.0),
      sector('Consumer D', 5.0),
      sector('Communications', 5.0),
      sector('Utilities', 5.0),
      sector('Energy', 5.0),
      sector('Materials', 5.0),
    ],
    liveEyebrow: 'Live Portfolio',
    liveHeading: 'Track our holdings in real time.',
    liveLede:
      "Our live-updating portfolio is maintained in a shared spreadsheet, reflecting current holdings and performance as they change. Take a look at what we're holding right now.",
    liveLinkLabel: 'View the Live Portfolio',
    liveLinkUrl:
      'https://docs.google.com/spreadsheets/d/1ff8IjaLRkRotDcTB5gvpM4UAcVdB9Ht6K_gTC7S11gM/edit?gid=892248907#gid=892248907',
    performersEyebrow: 'Top Performers',
    performersHeading: 'Our top performers.',
    topPerformers: [
      'Amazon Inc.',
      'Apple Inc.',
      'Activision Blizzard Inc.',
      'American Waterworks Co. Inc.',
      'Cisco Systems Inc.',
      'Dollar Tree Inc.',
      'Gilead Sciences Inc.',
      'Goldman Sachs Inc.',
      'Home Depot Inc.',
      'JP Morgan Chase & Co.',
      'United Healthcare Group Inc.',
      'Union Pacific Corp.',
    ],
    archiveEyebrow: 'Archive',
    archiveHeading: 'Portfolio history.',
    archiveLede: "Past snapshots of the Club's holdings, going back to 2016.",
    archiveEntries: await Promise.all([
      archiveEntry('January 2024', '2024-01-investment-club-holdings.xlsx'),
      archiveEntry('August 2023', '2023-08-investment-club-holdings.pdf'),
      archiveEntry('July 2020', '2020-07-investment-club-positions.pdf'),
      archiveEntry('August 2019', '2019-08-investment-club-holdings.pdf'),
      archiveEntry('May 2019', '2019-05-investment-club-holdings.pdf'),
      archiveEntry('December 2018', '2018-12-investment-club-holdings.xlsx'),
      archiveEntry('October 2018', '2018-10-investment-club-holdings.xlsx'),
      archiveEntry('April 2018', '2018-04-investment-club-positions.xlsx'),
      archiveEntry('February 2018', '2018-02-investment-club-positions.xlsx'),
      archiveEntry('November 2017', '2017-11-investment-club-portfolio.xlsx'),
      archiveEntry('December 2016', '2016-12-investment-club-portfolio.xlsx'),
      archiveEntry('August 2016', '2016-08-investment-club-portfolio.csv'),
    ]),
  })

  console.log('Get Involved Page...')
  await client.createOrReplace({
    _id: 'getInvolvedPage',
    _type: 'getInvolvedPage',
    pageHeader: {
      _type: 'pageHeader',
      eyebrow: 'Membership',
      title: 'Get Involved',
      lede: "Open to every major, every class year, and every level of experience. Here's how to join.",
    },
    introBody: [
      p(
        "Students of all majors, interests, backgrounds, and experience levels are welcome at the Lafayette Investment Club. While there's no requirement for participation, involved members receive perks and a better chance at an officer position.",
      ),
      rich([
        {text: 'New members join a sector coverage team, sit in on weekly meetings, and learn the pitch process described in '},
        {text: 'How to Pitch a Stock', href: 'how-to-pitch-a-stock.html'},
        {
          text: ". From there, it's on you: present twice, keep your attendance above 50%, and you're eligible to run for an officer position at the next semester's elections.",
        },
      ]),
      p(
        "If you'd like to help on a presentation or have an idea for a Friday meeting, come to the executive board meetings held every Friday after the general meeting in the Simon Conference Room.",
      ),
    ],
    waysEyebrow: 'Ways to Get Involved',
    waysHeading: 'Three ways to get started.',
    ways: [
      infoBlock('Market Update', [
        p(
          'An easy way to start. Market updates happen at almost every meeting and are a short, informal presentation on what happened in the markets that week.',
        ),
      ]),
      infoBlock('Buy/Sell Proposal', [
        p(
          "If you think the portfolio would do better with the addition or removal of a security, don't hesitate to voice your ideas. Because of past experiences, start-ups typically aren't considered. Your proposal should cover:",
        ),
        li('Details of the proposal: asset name, ticker, amount in $, time frame'),
        li('Brief description of the company'),
        li('Company performance vs. sector performance'),
        li('Why we should invest'),
        li('Future predictions, both optimistic and pessimistic'),
      ]),
      infoBlock('Educational or Guest Speaker Idea', [
        p(
          "Have an idea for an educational presentation, or know someone who'd make a great guest speaker for the club? Share your thoughts with the executive board.",
        ),
      ]),
    ],
    resourcesEyebrow: 'Resources',
    resourcesHeading: 'Outside resources for research.',
    resourceCategories: [
      {
        _type: 'linkCategory',
        _key: key(),
        categoryName: 'News',
        links: [
          linkItem('The Wall Street Journal', 'https://www.wsj.com'),
          linkItem('MarketWatch', 'https://www.marketwatch.com'),
          linkItem('Bloomberg News', 'https://www.bloomberg.com'),
          linkItem('Forbes News', 'https://www.forbes.com'),
          linkItem('Morning Brew Daily Email', 'https://www.morningbrew.com'),
          linkItem('New York Times: DealBook', 'https://www.nytimes.com/section/business/dealbook'),
          linkItem('The Economist', 'https://www.economist.com'),
        ],
      },
      {
        _type: 'linkCategory',
        _key: key(),
        categoryName: 'Education',
        links: [
          linkItem('Investopedia', 'https://www.investopedia.com'),
          linkItem('Yahoo Finance', 'https://finance.yahoo.com'),
          linkItem('Google Finance', 'https://www.google.com/finance'),
        ],
      },
    ],
  })

  console.log('How to Pitch a Stock Page...')
  await client.createOrReplace({
    _id: 'howToPitchPage',
    _type: 'howToPitchPage',
    pageHeader: {
      _type: 'pageHeader',
      eyebrow: 'Members',
      title: 'How to Pitch a Stock',
      lede: "The path from an idea to a live position in the club's portfolio — three steps, run every week during the semester.",
    },
    processFootnote: [
      rich([
        {text: 'New to the club? Start with '},
        {text: 'Get Involved', href: 'get-involved.html'},
        {text: ' for how to join a coverage team, or see the '},
        {text: 'Sector Allocation', href: 'index.html#sectors'},
        {text: ' breakdown for which sectors are actively covered.'},
      ]),
    ],
    questionsEyebrow: 'Pitch Framework',
    questionsHeading: 'Three questions every pitch must answer.',
    questionsLede: 'Who, what, and why — the backbone of a strong stock pitch.',
    questions: [
      infoBlock('Who?', [
        li('General background of the company: headquarters, number of employees, store or manufacturing locations'),
        li(
          "The C-suite — the executive-level managers within a company (CEO, CFO, CIO). What's their experience in the industry? New, old, scandals?",
        ),
        li('Detail the company culture'),
      ]),
      infoBlock('What?', [
        li('What product or service does this company provide?'),
        li("Understand and be able to explain exactly what the company does — never pitch a company you don't understand"),
      ]),
      infoBlock('Why?', [
        rich([
          {text: 'Catalyst: ', bold: true},
          {text: 'an event, or expectation of an event, that drastically changes the price of a stock.'},
        ]),
        li('Why buy now?'),
        li('Why is it undervalued?'),
        li('What will change that will increase the share price?'),
        li('Is there a different reason to invest — diversification, income?'),
      ]),
    ],
    additionalInfo: [
      infoBlock('Financial Metrics', [
        p('Market cap, P/E ratio, 52-week range, beta, reported earnings and earnings estimates, EBITDA.'),
        p('Talk about what you know and keep it simple — revenue, profit, margins.'),
      ]),
      infoBlock('Compare to a Rival and Industry Average', [
        li('Why this company instead of a competitor?'),
        li('What makes it superior?'),
        p('A good way to summarize the pitch partway through.'),
      ]),
      infoBlock('Risks', [
        p(
          "Don't be afraid to share the risks of your proposed investment. No company is perfect, and an educated audience knows this — acknowledging risk legitimizes your argument.",
        ),
        p("Don't dwell on it. Have a good defense ready, and spin it to benefit your argument."),
      ]),
      infoBlock('Research Resources', [
        p("Always check a company's Investor Relations page for earnings, annual reports, and more."),
        rich([{text: 'macrotrends.net', href: 'https://www.macrotrends.net'}], {listItem: 'bullet'}),
        rich([{text: 'gurufocus.com', href: 'https://www.gurufocus.com'}], {listItem: 'bullet'}),
      ]),
    ],
  })

  console.log('Alumni Page...')
  await client.createOrReplace({
    _id: 'alumniPage',
    _type: 'alumniPage',
    pageHeader: {
      _type: 'pageHeader',
      eyebrow: 'Alumni',
      title: 'Alumni Network',
      lede: 'A strong network of alumni and industry professionals who are willing to help current members with internships and networking.',
    },
    thanksIntroBody: [
      p(
        "Our network of alumni and professionals has been instrumental to the successful history of the Lafayette Investment Club — whether sharing advice, talking to the club as a guest speaker, assisting with the Club's trips to New York City, and much more.",
      ),
      p('We appreciate all support from all sources. If you would like to get involved as a guest speaker or mentor, please contact the club.'),
    ],
    thanksLine: 'And from all of us, thank you!',
    networkingBody: [
      p(
        'The club maintains a strong network of alumni who are happy to help current members with internships and networking. Feel free to reach out to any member of the executive team to get connected — they can pass along contacts to network with, plus a quick crash course on how to format a cold email and go about setting up a call.',
      ),
      p(
        "We're also working on adding a networking-specific segment to our regular meetings, aimed at teaching younger students the basics early so they have a head start on building their own network.",
      ),
    ],
    placementsEyebrow: 'Placements',
    placementsHeading: 'Where our alumni work.',
    placementsLede:
      'Lafayette Investment Club alumni have interned at and received full-time offers from firms across banking, asset management, trading, and consulting. Hover or focus a name to see what it does.',
    placements: [
      placement('Bank of America', 'Global bank offering consumer, corporate, and investment banking services.'),
      placement('J.P. Morgan', 'Global investment bank and financial services firm.'),
      placement('Citibank', 'Global consumer and institutional banking arm of Citigroup.'),
      placement('Goldman Sachs', 'Global investment bank specializing in banking, securities, and asset management.'),
      placement('Morgan Stanley', 'Global investment bank and wealth management firm.'),
      placement('BlackRock', "The world's largest asset manager, known for its iShares ETFs."),
      placement('Santander', 'Spanish multinational bank with global consumer and commercial operations.'),
      placement('Neuberger Berman', 'Independent, employee-owned asset management firm.'),
      placement('Blackstone', "The world's largest alternative asset manager, spanning private equity, real estate, and credit."),
      placement('STAR Capital', 'Private investment and capital management firm.'),
      placement('Susquehanna International Group', 'Global quantitative trading and technology firm.'),
      placement('Bloomberg', 'Financial data, media, and technology company behind the Bloomberg Terminal.'),
      placement('Barclays', 'British multinational investment bank and financial services company.'),
      placement('Jefferies', 'Global investment banking and capital markets firm.'),
      placement('HSBC', 'British multinational banking and financial services organization.'),
      placement('NYSE', "The New York Stock Exchange, the world's largest stock exchange by market capitalization."),
      placement('Merrill Lynch', 'Wealth management and investment banking division of Bank of America.'),
      placement('BCG', 'Boston Consulting Group — global management consulting firm.'),
      placement('KPMG', 'Global professional services and accounting firm, one of the Big Four.'),
    ],
  })

  console.log('Photo Gallery Page...')
  await client.createOrReplace({
    _id: 'photoGalleryPage',
    _type: 'photoGalleryPage',
    pageHeader: {
      _type: 'pageHeader',
      eyebrow: 'Photo Gallery',
      title: 'Photo Gallery',
    },
    placeholderMessage: "We're working on gathering photos and will be updating this page as soon as possible.",
  })

  console.log('\nDone. All 11 documents seeded.')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
