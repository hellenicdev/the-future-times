const slugify = require('../utils/slugify')
const config = require('../config')
const { generateCompletion } = require('./groqClient')

const MOCK_ARTICLES = {
  'Technology': [
    { title: 'Quantum Internet Achieves Global Scale, Ushering in Unhackable Communications', summary: 'The first fully operational quantum internet network now spans all seven continents, promising perfectly secure communications for governments, businesses, and citizens alike.', body: 'In a landmark achievement that redefines global communications, the Quantum Internet Initiative announced today that its quantum entanglement-based network now covers every inhabited continent. The network, which uses quantum key distribution (QKD) to transmit information in a manner that is physically impossible to intercept without detection, represents a 14-year effort involving over 80 nations.\n\nDr. Elena Vasquez, the initiative\'s director, described the achievement as "the most significant infrastructure project since the original internet." Unlike classical networks, where data can be copied or intercepted, quantum networks leverage the fundamental properties of quantum mechanics—any attempt to observe quantum data alters it, making eavesdropping instantly detectable.\n\nThe implications are profound. Financial institutions are already migrating sensitive transactions to the quantum layer. Governments are establishing quantum diplomatic channels. And everyday citizens will soon have access to quantum-encrypted messaging through consumer devices that have been quantum-ready since the late 2030s.\n\nCritics point to the digital divide: while 42 nations have full quantum access, developing regions face significant infrastructure gaps. The Quantum Internet Initiative has pledged $200 billion to close this gap by 2045.', confidence: 78, confidenceExplanation: 'Based on current quantum computing roadmaps, government investment trends, and the demonstrated viability of QKD networks in metropolitan areas. The timeline is ambitious but supported by Moore\'s-law-like advances in qubit stability.' },
    { title: 'Autonomous AI Agents Now Manage 90% of Global Supply Chains', summary: 'A quiet revolution has transformed logistics as AI agents coordinate manufacturing, shipping, and delivery across the planet with minimal human input.', body: 'Ten years ago, the idea that autonomous software agents would manage nearly all global logistics seemed speculative. Today, it is reality. According to the International Logistics Federation, 90.4% of all cross-border supply chain decisions are now made by AI agents that negotiate, route, and optimize in real-time.\n\nThese agents, built on large language model architectures combined with specialized optimization algorithms, communicate with each other using a standardized protocol called SupplyNet. When a factory in Vietnam needs raw materials from Brazil, AI agents on both ends negotiate price, shipping windows, and customs clearance without human intervention.\n\nThe shift has reduced global logistics costs by 34% and cut average delivery times by 52%. However, concerns about systemic risk remain. In 2041, a cascading failure in the South American grain network caused a two-week disruption that affected 14 countries. Regulators are now debating whether "human-in-the-loop" requirements should be reinstated for critical supply nodes.', confidence: 72, confidenceExplanation: 'Current trends in AI agent research, supply chain digitization, and the rapid adoption of LLM-based automation. The 90% figure is projected from the current 30% automation rate with exponential growth curves.' },
    { title: 'Consumer Brain-Computer Interfaces Hit Mainstream as Neural Link Devices Sell 50 Million Units', summary: 'Non-invasive neural interfaces have become the must-have tech of 2041, enabling thought-to-text communication, memory enhancement, and direct brain-to-device control.', body: 'When Neuralink released its first consumer product in 2035, it was a niche device for medical applications. Six years later, brain-computer interfaces (BCIs) have gone fully mainstream. Industry analyst firm TechVision reports that 50 million BCI units were sold in the past year alone—a 300% increase from 2040.\n\nThe breakthrough came from two developments: non-invasive sensors that can read neural signals through the skull with high fidelity, and AI decoders that can interpret brain activity patterns with 99.7% accuracy. Users now compose messages by thinking, control smart home devices with intention, and even enhance memory formation.\n\nEthicists have raised alarms about neural privacy. "Your thoughts should be your own," argues Dr. Marcus Chen of the Digital Rights Foundation. Several jurisdictions have passed "neural rights" laws prohibiting unauthorized access to brain data. The BCI industry has responded with on-device processing guarantees, but questions about long-term neural data sovereignty remain unresolved.', confidence: 65, confidenceExplanation: 'BCI technology is progressing rapidly but consumer adoption timelines are uncertain. The projection assumes continued breakthroughs in non-invasive sensing and AI decoding, which have demonstrated accelerating progress.' },
  ],
  'Business': [
    { title: 'The Four-Day Workweek Becomes Law Across the European Economic Bloc', summary: 'In a historic vote, the European Parliament has mandated a 32-hour maximum workweek, citing AI productivity gains and improved quality of life.', body: 'The European Economic Bloc has made history by passing the Work-Life Balance Act, which limits the legal workweek to 32 hours across all member states. The law, which takes effect in January 2042, is the culmination of a two-decade movement accelerated by artificial intelligence\'s dramatic impact on workplace productivity.\n\nSupporters point to pilot programs in Iceland, Spain, and Germany that showed no reduction in output when workers shifted to four-day schedules. "AI has eliminated so much busywork that we\'re essentially paying people to be present, not productive," said European Commissioner for Digital Affairs Sofia Bergström. "This law aligns our labor framework with technological reality."\n\nBusiness groups are divided. While many tech companies have already adopted flexible schedules, traditional industries like manufacturing and hospitality argue that coverage requirements make the mandate impractical. The law includes a phased implementation and hardship exemptions for small businesses.', confidence: 81, confidenceExplanation: 'The four-day workweek movement has strong momentum globally, with numerous successful trials. Legislative action in Europe is consistent with the bloc\'s historical pattern of worker protection laws.' },
  ],
  'Science': [
    { title: 'Fusion Energy Achieves Grid Parity: Commercial Plants Now Cheaper Than Solar', summary: 'Helion Energy\'s seventh-generation fusion reactor has reached a levelized cost of $18 per MWh, undercutting every other energy source in history.', body: 'The fusion revolution is no longer coming—it has arrived. Helion Energy announced today that its newest fusion plant in Nevada has achieved a levelized cost of energy (LCOE) of $18 per megawatt-hour, making it cheaper than solar ($22/MWh), wind ($20/MWh), and dramatically cheaper than natural gas ($45/MWh) or coal ($65/MWh).\n\n"What we\'ve done is build a sun in a box, and now we\'ve made it cheaper than the real sun," said Helion CEO Dr. Sarah Chen at the announcement. The plant uses a boron-hydrogen fuel cycle that produces no neutrons, meaning virtually no radioactive waste—a criticism that plagued earlier deuterium-tritium designs.\n\nThe implications for climate change are staggering. Twelve nations have already signed agreements to phase out fossil fuel power plants entirely by 2045, a timeline that seemed impossible just a decade ago. Fusion-powered desalination is expected to solve water scarcity in arid regions, and fusion-powered cargo ships are already in prototype.', confidence: 55, confidenceExplanation: 'Fusion has made remarkable technical progress but commercial viability timelines remain speculative. The confluence of private investment ($12B+), multiple reactor designs showing net gain, and regulatory tailwinds suggests a realistic path, but engineering challenges at scale persist.' },
  ],
  'Climate': [
    { title: 'Great Green Wall Stretches Across the Sahel: 8,000 Kilometers of Restored Land', summary: 'Africa\'s ambitious reforestation project has surpassed all expectations, restoring 100 million hectares of once-barren land and transforming regional climate patterns.', body: 'Twenty years after its launch, the Great Green Wall initiative has achieved what many called impossible. An 8,000-kilometer belt of restored vegetation now stretches across the entire Sahel region, from Senegal in the west to Djibouti in the east. The project has restored 100 million hectares of degraded land—an area larger than Egypt.\n\nThe results have been transformative. Regional rainfall has increased by 25% in restored areas. Twenty million families have regained food security. And carbon sequestration from the restored ecosystems now absorbs 250 million tons of CO2 annually.\n\n"The Great Green Wall proves that we can reverse desertification at continental scale," said Dr. Amina Ouedraogo, the project\'s director. "It required unprecedented cooperation between 22 nations, but the return on investment—both ecological and economic—has been extraordinary."', confidence: 85, confidenceExplanation: 'Based on the existing Great Green Wall initiative\'s current progress, increasing international funding commitments, and proven restoration techniques. The timeline has been extended but is consistent with current momentum.' },
  ],
  'World': [
    { title: 'Global Digital Currency Initiative Reaches 120 Nations as Cash Use Declines 80%', summary: 'The World Digital Currency, a supranational digital tender backed by a coalition of 120 nations, has become the most widely used currency on Earth.', body: 'In a transformation that central bankers once dismissed as impossible, digital currency has become the dominant form of money worldwide. The World Digital Currency (WDC), launched in 2038 by a coalition of 120 nations, now accounts for 67% of all global transactions according to the Bank for International Settlements.\n\nPhysical cash usage has declined by 80% since 2025, with many nations operating entirely cashless economies. The WDC system uses a two-tier architecture: a central blockchain managed by the coalition\'s central bank, and private licensed intermediaries—banks, fintechs, and even tech companies—that handle consumer-facing services.\n\nCritics warn of surveillance risks, as every transaction is recorded on the public ledger. Privacy advocates have pushed for zero-knowledge proof layers that would hide transaction details while maintaining auditability. Several nations have implemented such privacy layers, creating a patchwork of privacy standards.', confidence: 70, confidenceExplanation: 'CBDC development is accelerating globally with over 100 nations exploring digital currencies. The timeline assumes continued cooperation and standardization, though political hurdles could slow adoption.' },
  ],
  'Health': [
    { title: 'AI Primary Care: Machines Now Diagnose More Accurately Than Human Doctors in 95% of Cases', summary: 'A landmark 10-year study confirms that AI diagnostic systems outperform human physicians across nearly all common conditions, reshaping healthcare delivery worldwide.', body: 'The largest clinical study in medical history has reached a definitive conclusion: AI diagnostic systems are now more accurate than human physicians in 95% of common medical conditions. The study, published in The Lancet Digital Health, tracked 50 million patient encounters across 2,000 clinics in 30 countries over 10 years.\n\nAI systems achieved a 97.3% diagnostic accuracy rate compared to 89.1% for human physicians. The AI was particularly superior in dermatology (99.1% vs 86.2%), radiology (98.7% vs 87.3%), and early detection of rare conditions where human doctors had limited experience.\n\nRather than replacing doctors, the healthcare system has evolved into a partnership model. AI handles initial diagnosis and routine care, while human physicians focus on complex cases, surgical procedures, and the empathetic aspects of patient care that machines cannot replicate.', confidence: 88, confidenceExplanation: 'AI diagnostic accuracy has already matched or exceeded humans in specific domains. The timeline for comprehensive deployment is supported by current regulatory trends and investment in health AI, with major health systems already piloting these systems.' },
  ],
  'Sports': [
    { title: 'Holographic Stadiums Bring Global Audiences Into Live Sports Experiences', summary: 'A new generation of holographic projection technology allows millions of fans to experience live sporting events from any location as if they were in the stadium.', body: 'The era of watching sports on screens is giving way to something far more immersive. Holographic Sports Technologies (HST) has deployed its HoloStadium system in 45 major venues worldwide, allowing up to 500,000 remote viewers per event to experience the game as three-dimensional holographic projections in local viewing centers.\n\nThe technology uses thousands of tiny projectors and LiDAR sensors to create real-time, full-scale holographic reconstructions of every player and the ball. Remote viewers—gathered in local HoloLounges or using personal HoloDecks—see the action from any angle they choose, as if they were standing on the field.\n\n"Being able to walk around a holographic quarterback and see the game from his perspective, then instantly switch to a bird\'s-eye view—it\'s revolutionary," said NFL Commissioner Jamal Williams. Ticket sales for physical attendance have actually increased, as the in-person experience remains distinct, while the holographic option has expanded the total audience by 400%.', confidence: 60, confidenceExplanation: 'Holographic display technology is advancing rapidly but large-scale deployment faces cost and infrastructure hurdles. The projection assumes continued investment in immersive entertainment, driven by consumer demand for novel experiences.' },
  ],
  'Entertainment': [
    { title: 'AI-Generated Film Wins Academy Award for Best Picture in Historic First', summary: 'The film "Echoes of Tomorrow," created entirely by generative AI with no human writers or directors, has won the Oscar for Best Picture, sparking intense debate about the nature of art.', body: 'The Academy of Motion Picture Arts and Sciences made history last night by awarding the Best Picture Oscar to "Echoes of Tomorrow," a film generated entirely by artificial intelligence. The movie, created by the AI system Muse v4.0, had no human writers, directors, or cinematographers—every frame, line of dialogue, and musical note was generated by machine intelligence.\n\nThe film tells the story of humanity\'s last day before a cosmic event erases time, exploring themes of memory, love, and loss through a non-linear narrative that critics have called "impossibly beautiful" and "emotionally devastating."\n\nThe victory has reignited debates about the definition of art and the role of human creativity. "This is not the end of human filmmaking, but a new medium to explore," said the CEO of Muse Studios, accepting the award. "AI doesn\'t replace human creativity—it democratizes it, making cinematic storytelling accessible to anyone with a vision."', confidence: 45, confidenceExplanation: 'AI-generated content is advancing rapidly but critical acceptance remains uncertain. The timeline for an AI film winning major awards depends as much on cultural acceptance as technical capability, making this a high-variance prediction.' },
  ],
}

const usedSlugs = new Set()

function uniqueSlug(title) {
  let slug = slugify(title)
  let base = slug
  let i = 1
  while (usedSlugs.has(slug)) {
    slug = `${base}-${i}`
    i++
  }
  usedSlugs.add(slug)
  return slug
}

function generateMockArticle(category, futureDate) {
  const articles = MOCK_ARTICLES[category] || MOCK_ARTICLES['Technology']
  const article = articles[Math.floor(Math.random() * articles.length)]
  return {
    ...article,
    slug: uniqueSlug(article.title),
    category,
    futureDate,
  }
}

async function generateArticle({ futureDate, category, trends }) {
  if (config.isMockMode) {
    return generateMockArticle(category, futureDate)
  }

  const yearsAhead = parseInt(futureDate.split('-')[0], 10) - new Date().getFullYear()
  const trendContext = trends.map(t => `- ${t}`).join('\n')

  const prompt = `You are a journalist writing for "The Future Times," a newspaper that reports on future events as if they have already happened.
The current year is ${futureDate}, ${yearsAhead} years from today.

Category: ${category}

Relevant trends and context for this future:
${trendContext}

Write a news article from the year ${futureDate} in the ${category} category. The article should:
1. Sound like a real newspaper article from a reputable publication
2. Reference specific dates, technologies, policies, or events that could plausibly exist
3. Include quotes from experts, officials, or studies
4. Mention both achievements and ongoing challenges
5. Be 3-5 paragraphs long

Return valid JSON only with these fields:
- "title": a compelling headline
- "summary": a one-sentence summary
- "body": the full article text (3-5 paragraphs, each separated by \\n\\n)
- "confidence": a number 0-100 indicating how confident this prediction is
- "confidenceExplanation": a brief explanation of what factors support this prediction`

  try {
    const response = await generateCompletion([{ role: 'user', content: prompt }], {
      temperature: 0.85,
      maxTokens: 2048,
    })
    if (!response) throw new Error('Empty response from Groq')
    const parsed = JSON.parse(response)
    return {
      title: parsed.title,
      slug: uniqueSlug(parsed.title),
      category,
      summary: parsed.summary,
      body: parsed.body,
      confidence: Math.min(100, Math.max(0, parsed.confidence || 50)),
      confidenceExplanation: parsed.confidenceExplanation || '',
      futureDate,
    }
  } catch (err) {
    console.error(`Article generation error for ${category}:`, err.message)
    return generateMockArticle(category, futureDate)
  }
}

module.exports = { generateArticle, MOCK_ARTICLES }
