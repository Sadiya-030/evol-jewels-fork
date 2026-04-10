const gemstoneImages = {
  garnet: "https://images.unsplash.com/photo-1551122089-4e3e72477432?w=400&q=80",
  amethyst: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=400&q=80",
  aquamarine: "https://images.unsplash.com/photo-1583937443566-6b087e0f78c8?w=400&q=80",
  diamond: "https://images.unsplash.com/photo-1586104237516-5765cf54e56a?w=400&q=80",
  emerald: "https://images.unsplash.com/photo-1574948495680-f13dc97c0964?w=400&q=80",
  pearl: "https://images.unsplash.com/photo-1591209627710-d2427a93a890?w=400&q=80",
  ruby: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=400&q=80",
  sapphire: "https://images.unsplash.com/photo-1615655114865-4cc1fda5c6e9?w=400&q=80",
  opal: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&q=80",
  topaz: "https://images.unsplash.com/photo-1583937443566-6b087e0f78c8?w=400&q=80",
  turquoise: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=400&q=80",
  agate: "https://images.unsplash.com/photo-1615655114865-4cc1fda5c6e9?w=400&q=80",
};

const sunSignData = {
  aries: {
    dateRange: "Mar 21 – Apr 19",
    gemstone: "diamond",
    description: "You are an Aries, bold and fearless, a natural-born leader.",
    resonance:
      "Diamond mirrors your unbreakable strength and brilliant clarity.",
    properties: "Amplifies courage and brings mental clarity.",
    blessing: "May your path shine bright with unwavering courage.",
  },
  taurus: {
    dateRange: "Apr 20 – May 20",
    gemstone: "emerald",
    description:
      "You are a Taurus, grounded in strength and touched by beauty.",
    resonance: "Emerald reflects your love for growth and natural abundance.",
    properties: "Brings harmony and manifests prosperity.",
    blessing: "May abundance flow to you like spring after winter.",
  },
  gemini: {
    dateRange: "May 21 – Jun 20",
    gemstone: "agate",
    description: "You are a Gemini, quick-witted and endlessly curious.",
    resonance:
      "Agate balances your dual nature and grounds your mental energy.",
    properties: "Enhances concentration and emotional balance.",
    blessing: "May your words carry wisdom and curiosity guide you.",
  },
  cancer: {
    dateRange: "Jun 21 – Jul 22",
    gemstone: "pearl",
    description: "You are a Cancer, nurturing and deeply intuitive.",
    resonance: "Pearl mirrors your emotional depth and gentle luminescence.",
    properties: "Brings calming reflection and emotional balance.",
    blessing: "May your heart stay tender and intuition guide you.",
  },
  leo: {
    dateRange: "Jul 23 – Aug 22",
    gemstone: "ruby",
    description: "You are a Leo, radiant and regal, born to shine.",
    resonance: "Ruby burns with the fire that fuels your passionate heart.",
    properties: "Ignites passion and brings creative success.",
    blessing: "May your light never dim and warmth inspire others.",
  },
  virgo: {
    dateRange: "Aug 23 – Sep 22",
    gemstone: "sapphire",
    description: "You are a Virgo, thoughtful and precise in all you do.",
    resonance: "Sapphire matches your analytical mind and pure intentions.",
    properties: "Enhances clarity and manifests highest intentions.",
    blessing: "May wisdom guide you and peace fill your heart.",
  },
  libra: {
    dateRange: "Sep 23 – Oct 22",
    gemstone: "opal",
    description: "You are a Libra, seeking beauty and balance always.",
    resonance: "Opal's shifting colors reflect your gift for harmony.",
    properties: "Enhances creativity and attracts positive relationships.",
    blessing: "May balance find you and beauty surround you.",
  },
  scorpio: {
    dateRange: "Oct 23 – Nov 21",
    gemstone: "topaz",
    description: "You are a Scorpio, intense and deeply transformative.",
    resonance: "Topaz channels your power and transformative nature.",
    properties: "Brings clarity and supports spiritual transformation.",
    blessing: "May you transform darkness into radiant light.",
  },
  sagittarius: {
    dateRange: "Nov 22 – Dec 21",
    gemstone: "turquoise",
    description: "You are a Sagittarius, an eternal seeker of truth.",
    resonance: "Turquoise aligns with your wandering and optimistic spirit.",
    properties: "Enhances communication and brings good fortune.",
    blessing: "May your arrows find their mark and journeys enlighten.",
  },
  capricorn: {
    dateRange: "Dec 22 – Jan 19",
    gemstone: "garnet",
    description: "You are a Capricorn, ambitious and steadfast in purpose.",
    resonance: "Garnet resonates with your grounded ambition and strength.",
    properties: "Enhances commitment and manifests long-term goals.",
    blessing: "May your efforts bear fruit and legacy endure.",
  },
  aquarius: {
    dateRange: "Jan 20 – Feb 18",
    gemstone: "amethyst",
    description: "You are an Aquarius, a visionary with unique perspective.",
    resonance:
      "Amethyst connects with your innovative and humanitarian spirit.",
    properties: "Stimulates the mind and enhances spiritual awareness.",
    blessing: "May your vision inspire change and light the way.",
  },
  pisces: {
    dateRange: "Feb 19 – Mar 20",
    gemstone: "aquamarine",
    description: "You are a Pisces, a dreamer of infinite imagination.",
    resonance: "Aquamarine flows with your intuitive and creative nature.",
    properties: "Brings calm courage and enhances artistic expression.",
    blessing: "May your dreams manifest and compassion heal the world.",
  },
};

function getSunSignFromDate(birthdate) {
  let day, month, year;

  // Handle DD-MM-YYYY format (e.g., "12-01-1999")
  if (birthdate.includes("-")) {
    const parts = birthdate.split("-");
    if (parts.length === 3) {
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
    }
  }
  // Handle YYYY-MM-DD format (e.g., "1999-01-12")
  else if (birthdate.includes("/")) {
    const parts = birthdate.split("/");
    if (parts.length === 3) {
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
    }
  }
  // Fallback to Date parsing
  else {
    const date = new Date(birthdate);
    month = date.getMonth() + 1;
    day = date.getDate();
  }

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
    return "scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
    return "sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
    return "capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
    return "aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "pisces";

  return "aries"; // fallback
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { sunSign, birthdate, city, timeOfBirth } = body;

    if (!sunSign && !birthdate) {
      return Response.json(
        { error: "Either sun sign or birthdate is required" },
        { status: 400 }
      );
    }

    let determinedSign = sunSign?.toLowerCase();

    if (!determinedSign && birthdate) {
      determinedSign = getSunSignFromDate(birthdate);
    }

    const signData = sunSignData[determinedSign];

    if (!signData) {
      return Response.json({ error: "Invalid sun sign" }, { status: 400 });
    }

    const gemstoneName = signData.gemstone.toLowerCase();
    let gemstoneImage = gemstoneImages[gemstoneName];

    if (!gemstoneImage) {
      const matchingKey = Object.keys(gemstoneImages).find(
        (key) => gemstoneName.includes(key) || key.includes(gemstoneName)
      );
      gemstoneImage = matchingKey
        ? gemstoneImages[matchingKey]
        : "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400";
    }

    const response = {
      success: true,
      birthDetails: {
        sunSign:
          determinedSign.charAt(0).toUpperCase() + determinedSign.slice(1),
        birthdate: birthdate || null,
        city: city || "Not provided",
        timeOfBirth: timeOfBirth || "Not provided",
        dateRange: signData.dateRange,
      },
      cosmicReading: {
        signDescription: signData.description,
        gemstone: {
          name:
            signData.gemstone.charAt(0).toUpperCase() +
            signData.gemstone.slice(1),
          image: gemstoneImage,
          resonance: signData.resonance,
          properties: signData.properties,
        },
        blessing: signData.blessing,
      },
      generatedAt: new Date().toISOString(),
    };

    return Response.json(response);
  } catch (error) {
    console.error("Birth stone API error:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to generate cosmic gemstone reading",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
