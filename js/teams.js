/**
 * FOOTBALL MATCH ROULETTE - DATABASE TIM & NEGARA (182 TIM)
 * Data lengkap 182 tim & negara yang dikelompokkan berdasarkan kategori / liga.
 * Setiap tim memiliki: nama, kode singkatan, warna primer & sekunder, logo, serta tipe (club / nation).
 */

const TEAMS_DATABASE = {
  premier_league: {
    id: "premier_league",
    name: "Premier League",
    type: "club",
    region: "Inggris",
    badgeColor: "#38003c",
    teams: [
      {
        name: "Arsenal F.C.",
        short: "ARS",
        colors: ["#EF0107", "#063672"],
        logo: "https://media.api-sports.io/football/teams/42.png"
      },
      {
        name: "Aston Villa F.C.",
        short: "AVL",
        colors: ["#670E36", "#95BFE5"],
        logo: "https://media.api-sports.io/football/teams/66.png"
      },
      {
        name: "A.F.C. Bournemouth",
        short: "BOU",
        colors: ["#DA291C", "#000000"],
        logo: "https://media.api-sports.io/football/teams/35.png"
      },
      {
        name: "Brentford F.C.",
        short: "BRE",
        colors: ["#E30613", "#FBE122"],
        logo: "https://media.api-sports.io/football/teams/55.png"
      },
      {
        name: "Brighton & Hove Albion F.C.",
        short: "BHA",
        colors: ["#0057B8", "#FFCD00"],
        logo: "https://media.api-sports.io/football/teams/51.png"
      },
      {
        name: "Burnley F.C.",
        short: "BUR",
        colors: ["#6C1D45", "#99D6EA"],
        logo: "https://media.api-sports.io/football/teams/44.png"
      },
      {
        name: "Chelsea F.C.",
        short: "CHE",
        colors: ["#034694", "#EE242C"],
        logo: "https://media.api-sports.io/football/teams/49.png"
      },
      {
        name: "Crystal Palace F.C.",
        short: "CRY",
        colors: ["#1B458F", "#C4122E"],
        logo: "https://media.api-sports.io/football/teams/52.png"
      },
      {
        name: "Everton F.C.",
        short: "EVE",
        colors: ["#003399", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/45.png"
      },
      {
        name: "Leeds United F.C.",
        short: "LEE",
        colors: ["#FFCD00", "#1D428A"],
        logo: "https://media.api-sports.io/football/teams/63.png"
      },
      {
        name: "Liverpool F.C.",
        short: "LIV",
        colors: ["#C8102E", "#00B2A9"],
        logo: "https://media.api-sports.io/football/teams/40.png"
      },
      {
        name: "Manchester City F.C.",
        short: "MCI",
        colors: ["#6CABDD", "#1C2C5B"],
        logo: "https://media.api-sports.io/football/teams/50.png"
      },
      {
        name: "Manchester United F.C.",
        short: "MUN",
        colors: ["#DA291C", "#FBE122"],
        logo: "https://media.api-sports.io/football/teams/33.png"
      },
      {
        name: "Newcastle United F.C.",
        short: "NEW",
        colors: ["#241F20", "#41B6E6"],
        logo: "https://media.api-sports.io/football/teams/34.png"
      },
      {
        name: "Nottingham Forest F.C.",
        short: "NFO",
        colors: ["#DD0000", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/65.png"
      },
      {
        name: "Sunderland A.F.C.",
        short: "SUN",
        colors: ["#EB172B", "#000000"],
        logo: "https://media.api-sports.io/football/teams/746.png"
      },
      {
        name: "Tottenham Hotspur F.C.",
        short: "TOT",
        colors: ["#132257", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/47.png"
      },
      {
        name: "West Ham United F.C.",
        short: "WHU",
        colors: ["#7A263A", "#1BB1E7"],
        logo: "https://media.api-sports.io/football/teams/48.png"
      },
      {
        name: "Wolverhampton Wanderers F.C.",
        short: "WOL",
        colors: ["#FDB913", "#231F20"],
        logo: "https://media.api-sports.io/football/teams/39.png"
      }
    ]
  },

  championship: {
    id: "championship",
    name: "Sky Bet Championship",
    type: "club",
    region: "Inggris",
    badgeColor: "#162846",
    teams: [
      {
        name: "Birmingham City F.C.",
        short: "BCF",
        colors: ["#0000FF", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/56.png"
      },
      {
        name: "Blackburn Rovers F.C.",
        short: "ROV",
        colors: ["#00509F", "#E31B23"],
        logo: "https://media.api-sports.io/football/teams/67.png"
      },
      {
        name: "Bristol City F.C.",
        short: "BRC",
        colors: ["#E31B23", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/71.png"
      },
      {
        name: "Charlton Athletic F.C.",
        short: "CHA",
        colors: ["#ED1C24", "#000000"],
        logo: "https://media.api-sports.io/football/teams/61.png"
      },
      {
        name: "Coventry City F.C.",
        short: "COV",
        colors: ["#69B3E7", "#132257"],
        logo: "https://media.api-sports.io/football/teams/1359.png"
      },
      {
        name: "Derby County F.C.",
        short: "DER",
        colors: ["#000000", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/58.png"
      },
      {
        name: "Hull City A.F.C.",
        short: "HUL",
        colors: ["#F58220", "#000000"],
        logo: "https://media.api-sports.io/football/teams/64.png"
      },
      {
        name: "Ipswich Town F.C.",
        short: "IPS",
        colors: ["#003399", "#E03A3E"],
        logo: "https://media.api-sports.io/football/teams/57.png"
      },
      {
        name: "Leicester City F.C.",
        short: "LEI",
        colors: ["#003090", "#FDBE11"],
        logo: "https://media.api-sports.io/football/teams/46.png"
      },
      {
        name: "Middlesbrough F.C.",
        short: "MID",
        colors: ["#D71920", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/68.png"
      },
      {
        name: "Millwall F.C.",
        short: "MIL",
        colors: ["#002447", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/70.png"
      },
      {
        name: "Norwich City F.C.",
        short: "NOR",
        colors: ["#FFF200", "#00A651"],
        logo: "https://media.api-sports.io/football/teams/72.png"
      },
      {
        name: "Oxford United F.C.",
        short: "OXF",
        colors: ["#FFD100", "#002B49"],
        logo: "https://media.api-sports.io/football/teams/1360.png"
      },
      {
        name: "Portsmouth F.C.",
        short: "POR",
        colors: ["#001489", "#D71920"],
        logo: "https://media.api-sports.io/football/teams/69.png"
      },
      {
        name: "Preston North End F.C.",
        short: "PNE",
        colors: ["#FFFFFF", "#002B49"],
        logo: "https://media.api-sports.io/football/teams/60.png"
      },
      {
        name: "Queens Park Rangers F.C.",
        short: "QPR",
        colors: ["#1D70B8", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/73.png"
      },
      {
        name: "Sheffield United F.C.",
        short: "SHU",
        colors: ["#EE2737", "#000000"],
        logo: "https://media.api-sports.io/football/teams/62.png"
      },
      {
        name: "Sheffield Wednesday F.C.",
        short: "SHW",
        colors: ["#00539F", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/74.png"
      },
      {
        name: "Southampton F.C.",
        short: "SOU",
        colors: ["#D71920", "#132257"],
        logo: "https://media.api-sports.io/football/teams/41.png"
      },
      {
        name: "Stoke City F.C.",
        short: "STO",
        colors: ["#E03A3E", "#002F6C"],
        logo: "https://media.api-sports.io/football/teams/75.png"
      },
      {
        name: "Swansea City A.F.C.",
        short: "SWA",
        colors: ["#000000", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/76.png"
      },
      {
        name: "Watford F.C.",
        short: "WAT",
        colors: ["#FBEE23", "#ED2127"],
        logo: "https://media.api-sports.io/football/teams/38.png"
      },
      {
        name: "West Bromwich Albion F.C.",
        short: "WBA",
        colors: ["#122F67", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/78.png"
      },
      {
        name: "Wrexham A.F.C.",
        short: "WRX",
        colors: ["#DF181F", "#008054"],
        logo: "https://media.api-sports.io/football/teams/1824.png"
      }
    ]
  },

  serie_a: {
    id: "serie_a",
    name: "Serie A",
    type: "club",
    region: "Italia",
    badgeColor: "#024486",
    teams: [
      {
        name: "Atalanta B.C.",
        short: "ATA",
        colors: ["#1E71B8", "#000000"],
        logo: "https://media.api-sports.io/football/teams/499.png"
      },
      {
        name: "Bologna F.C. 1909",
        short: "BOL",
        colors: ["#A31A2F", "#172A45"],
        logo: "https://media.api-sports.io/football/teams/500.png"
      },
      {
        name: "Cagliari Calcio",
        short: "CAG",
        colors: ["#C8102E", "#0B2240"],
        logo: "https://media.api-sports.io/football/teams/490.png"
      },
      {
        name: "Como 1907",
        short: "COM",
        colors: ["#0038A8", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/889.png"
      },
      {
        name: "U.S. Cremonese",
        short: "CRE",
        colors: ["#A21920", "#868A8E"],
        logo: "https://media.api-sports.io/football/teams/520.png"
      },
      {
        name: "ACF Fiorentina",
        short: "FIO",
        colors: ["#482E92", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/502.png"
      },
      {
        name: "Genoa C.F.C.",
        short: "GEN",
        colors: ["#A6192E", "#0C2340"],
        logo: "https://media.api-sports.io/football/teams/495.png"
      },
      {
        name: "Hellas Verona F.C.",
        short: "VER",
        colors: ["#003366", "#FFCC00"],
        logo: "https://media.api-sports.io/football/teams/504.png"
      },
      {
        name: "F.C. Internazionale Milano",
        short: "INT",
        colors: ["#010E80", "#000000"],
        logo: "https://media.api-sports.io/football/teams/505.png"
      },
      {
        name: "Juventus F.C.",
        short: "JUV",
        colors: ["#000000", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/496.png"
      },
      {
        name: "S.S. Lazio",
        short: "LAZ",
        colors: ["#87D8F7", "#002F6C"],
        logo: "https://media.api-sports.io/football/teams/487.png"
      },
      {
        name: "U.S. Lecce",
        short: "LEC",
        colors: ["#FFCC00", "#D01E25"],
        logo: "https://media.api-sports.io/football/teams/867.png"
      },
      {
        name: "A.C. Milan",
        short: "ACM",
        colors: ["#FB090B", "#000000"],
        logo: "https://media.api-sports.io/football/teams/489.png"
      },
      {
        name: "S.S.C. Napoli",
        short: "NAP",
        colors: ["#12A0D7", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/492.png"
      },
      {
        name: "Parma Calcio 1913",
        short: "PAR",
        colors: ["#F8C300", "#003087"],
        logo: "https://media.api-sports.io/football/teams/523.png"
      },
      {
        name: "Pisa Sporting Club",
        short: "PIS",
        colors: ["#000000", "#0047AB"],
        logo: "https://media.api-sports.io/football/teams/891.png"
      },
      {
        name: "A.S. Roma",
        short: "ASR",
        colors: ["#8E1F2F", "#F0BC42"],
        logo: "https://media.api-sports.io/football/teams/497.png"
      },
      {
        name: "Torino F.C.",
        short: "TOR",
        colors: ["#8B2635", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/503.png"
      },
      {
        name: "Udinese Calcio",
        short: "UDI",
        colors: ["#000000", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/494.png"
      }
    ]
  },

  laliga: {
    id: "laliga",
    name: "LaLiga",
    type: "club",
    region: "Spanyol",
    badgeColor: "#e30613",
    teams: [
      {
        name: "Villarreal C.F.",
        short: "VIL",
        colors: ["#FFE100", "#004797"],
        logo: "https://media.api-sports.io/football/teams/533.png"
      },
      {
        name: "Valencia C.F.",
        short: "VAL",
        colors: ["#FFFFFF", "#000000"],
        logo: "https://media.api-sports.io/football/teams/532.png"
      },
      {
        name: "Real Sociedad de Fútbol",
        short: "RSO",
        colors: ["#004DA0", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/548.png"
      },
      {
        name: "Sevilla F.C.",
        short: "SEV",
        colors: ["#D4001F", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/536.png"
      },
      {
        name: "Real Oviedo",
        short: "OVI",
        colors: ["#003580", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/544.png"
      },
      {
        name: "Real Madrid C.F.",
        short: "RMA",
        colors: ["#FFFFFF", "#FEBE10"],
        logo: "https://media.api-sports.io/football/teams/541.png"
      },
      {
        name: "Real Betis Balompié",
        short: "BET",
        colors: ["#00954C", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/543.png"
      },
      {
        name: "C.A. Osasuna",
        short: "OSA",
        colors: ["#A21925", "#0B2240"],
        logo: "https://media.api-sports.io/football/teams/727.png"
      },
      {
        name: "R.C.D. Mallorca",
        short: "MAL",
        colors: ["#E20613", "#000000"],
        logo: "https://media.api-sports.io/football/teams/798.png"
      },
      {
        name: "Girona F.C.",
        short: "GIR",
        colors: ["#CE1126", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/547.png"
      },
      {
        name: "R.C.D. Espanyol de Barcelona",
        short: "ESP",
        colors: ["#007AC1", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/540.png"
      },
      {
        name: "R.C. Celta de Vigo",
        short: "CEL",
        colors: ["#87CEEB", "#CC0000"],
        logo: "https://media.api-sports.io/football/teams/538.png"
      },
      {
        name: "F.C. Barcelona",
        short: "BAR",
        colors: ["#A50044", "#004D98"],
        logo: "https://media.api-sports.io/football/teams/529.png"
      },
      {
        name: "Club Atlético de Madrid",
        short: "ATM",
        colors: ["#CB3524", "#1A355E"],
        logo: "https://media.api-sports.io/football/teams/530.png"
      },
      {
        name: "Deportivo Alavés",
        short: "ALA",
        colors: ["#0040A8", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/542.png"
      },
      {
        name: "Athletic Club",
        short: "ATH",
        colors: ["#EE2524", "#000000"],
        logo: "https://media.api-sports.io/football/teams/531.png"
      },
      {
        name: "U.D. Las Palmas",
        short: "LPA",
        colors: ["#FEE100", "#004B9B"],
        logo: "https://media.api-sports.io/football/teams/534.png"
      }
    ]
  },

  ligue_1: {
    id: "ligue_1",
    name: "Ligue 1",
    type: "club",
    region: "Prancis",
    badgeColor: "#091c3e",
    teams: [
      {
        name: "Paris FC",
        short: "PFC",
        colors: ["#002060", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/1063.png"
      },
      {
        name: "Paris Saint-Germain F.C.",
        short: "PSG",
        colors: ["#004170", "#DA291C"],
        logo: "https://media.api-sports.io/football/teams/85.png"
      },
      {
        name: "Stade Rennais F.C.",
        short: "REN",
        colors: ["#E30613", "#000000"],
        logo: "https://media.api-sports.io/football/teams/94.png"
      },
      {
        name: "R.C. Strasbourg Alsace",
        short: "RCS",
        colors: ["#009FE3", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/95.png"
      },
      {
        name: "O.G.C. Nice",
        short: "NIC",
        colors: ["#E2001A", "#000000"],
        logo: "https://media.api-sports.io/football/teams/84.png"
      },
      {
        name: "F.C. Nantes",
        short: "NAN",
        colors: ["#00853F", "#FFDA00"],
        logo: "https://media.api-sports.io/football/teams/83.png"
      },
      {
        name: "A.S. Monaco F.C.",
        short: "ASM",
        colors: ["#ED1C24", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/91.png"
      },
      {
        name: "Olympique de Marseille",
        short: "OM",
        colors: ["#2FAEE0", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/81.png"
      },
      {
        name: "Olympique Lyonnais",
        short: "OL",
        colors: ["#DA0812", "#133168"],
        logo: "https://media.api-sports.io/football/teams/80.png"
      },
      {
        name: "LOSC Lille",
        short: "LIL",
        colors: ["#E01E2B", "#1C2442"],
        logo: "https://media.api-sports.io/football/teams/79.png"
      },
      {
        name: "R.C. Lens",
        short: "RCL",
        colors: ["#E41B13", "#FFF000"],
        logo: "https://media.api-sports.io/football/teams/116.png"
      },
      {
        name: "Stade Brestois 29",
        short: "BRE",
        colors: ["#DA291C", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/106.png"
      }
    ]
  },

  blanda_jerman_portugal: {
    id: "blanda_jerman_portugal",
    name: "Belanda, Jerman & Portugal",
    type: "club",
    region: "Eropa",
    badgeColor: "#1f2937",
    teams: [
      {
        name: "AFC Ajax",
        short: "AJX",
        colors: ["#D2122E", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/194.png"
      },
      {
        name: "Feyenoord Rotterdam",
        short: "FEY",
        colors: ["#E30613", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/209.png"
      },
      {
        name: "PSV Eindhoven",
        short: "PSV",
        colors: ["#ED1C24", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/197.png"
      },
      {
        name: "Sporting CP",
        short: "SCP",
        colors: ["#008057", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/228.png"
      },
      {
        name: "F.C. Porto",
        short: "FCP",
        colors: ["#0038A8", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/212.png"
      },
      {
        name: "S.C. Braga",
        short: "BRA",
        colors: ["#D91A2A", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/217.png"
      },
      {
        name: "S.L. Benfica",
        short: "SLB",
        colors: ["#E80000", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/211.png"
      },
      {
        name: "Bayer 04 Leverkusen",
        short: "B04",
        colors: ["#E32221", "#000000"],
        logo: "https://media.api-sports.io/football/teams/168.png"
      },
      {
        name: "FC Bayern München",
        short: "BAY",
        colors: ["#DC052D", "#0066B2"],
        logo: "https://media.api-sports.io/football/teams/157.png"
      },
      {
        name: "Borussia Dortmund",
        short: "BVB",
        colors: ["#FDE100", "#000000"],
        logo: "https://media.api-sports.io/football/teams/165.png"
      },
      {
        name: "Eintracht Frankfurt",
        short: "SGE",
        colors: ["#E1000F", "#000000"],
        logo: "https://media.api-sports.io/football/teams/169.png"
      },
      {
        name: "RB Leipzig",
        short: "RBL",
        colors: ["#E21B23", "#0A1F44"],
        logo: "https://media.api-sports.io/football/teams/173.png"
      },
      {
        name: "VfB Stuttgart",
        short: "VFB",
        colors: ["#E32219", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/172.png"
      },
      {
        name: "SV Werder Bremen",
        short: "SVW",
        colors: ["#1D9650", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/162.png"
      },
      {
        name: "VfL Wolfsburg",
        short: "WOB",
        colors: ["#65B32E", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/161.png"
      }
    ]
  },

  eropa_lainnya: {
    id: "eropa_lainnya",
    name: "Eropa Lainnya",
    type: "club",
    region: "Eropa",
    badgeColor: "#0e7490",
    teams: [
      {
        name: "Club Brugge KV",
        short: "BRU",
        colors: ["#004990", "#000000"],
        logo: "https://media.api-sports.io/football/teams/569.png"
      },
      {
        name: "F.C. København",
        short: "FCK",
        colors: ["#003399", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/400.png"
      },
      {
        name: "Celtic F.C.",
        short: "CEL",
        colors: ["#018749", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/247.png"
      },
      {
        name: "Rangers F.C.",
        short: "RAN",
        colors: ["#003399", "#E30613"],
        logo: "https://media.api-sports.io/football/teams/257.png"
      },
      {
        name: "Beşiktaş J.K.",
        short: "BJK",
        colors: ["#000000", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/554.png"
      },
      {
        name: "Fenerbahçe S.K.",
        short: "FB",
        colors: ["#002D72", "#FFF000"],
        logo: "https://media.api-sports.io/football/teams/611.png"
      },
      {
        name: "Galatasaray S.K.",
        short: "GS",
        colors: ["#A32638", "#FCB514"],
        logo: "https://media.api-sports.io/football/teams/645.png"
      },
      {
        name: "Olympiacos F.C.",
        short: "OLY",
        colors: ["#DA291C", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/553.png"
      },
      {
        name: "SK Slavia Praha",
        short: "SLA",
        colors: ["#D40028", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/560.png"
      }
    ]
  },

  brazil: {
    id: "brazil",
    name: "Brazil",
    type: "club",
    region: "Amerika",
    badgeColor: "#047857",
    teams: [
      {
        name: "Clube Atlético Mineiro",
        short: "CAM",
        colors: ["#000000", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/1062.png"
      },
      {
        name: "E.C. Bahia",
        short: "BAH",
        colors: ["#005CA9", "#EA1D2C"],
        logo: "https://media.api-sports.io/football/teams/118.png"
      },
      {
        name: "Botafogo F.R.",
        short: "BOT",
        colors: ["#000000", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/120.png"
      },
      {
        name: "S.C. Corinthians Paulista",
        short: "COR",
        colors: ["#000000", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/131.png"
      },
      {
        name: "Cruzeiro E.C.",
        short: "CRU",
        colors: ["#003399", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/135.png"
      },
      {
        name: "C.R. Flamengo",
        short: "FLA",
        colors: ["#C5221F", "#000000"],
        logo: "https://media.api-sports.io/football/teams/127.png"
      },
      {
        name: "Fluminense F.C.",
        short: "FLU",
        colors: ["#8F1435", "#006437"],
        logo: "https://media.api-sports.io/football/teams/124.png"
      },
      {
        name: "Grêmio FBPA",
        short: "GRE",
        colors: ["#0D80BF", "#000000"],
        logo: "https://media.api-sports.io/football/teams/130.png"
      },
      {
        name: "S.C. Internacional",
        short: "INT",
        colors: ["#E30613", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/119.png"
      },
      {
        name: "S.E. Palmeiras",
        short: "PAL",
        colors: ["#006437", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/121.png"
      },
      {
        name: "Red Bull Bragantino",
        short: "RBB",
        colors: ["#DA291C", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/794.png"
      },
      {
        name: "Santos F.C.",
        short: "SAN",
        colors: ["#000000", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/128.png"
      },
      {
        name: "C.R. Vasco da Gama",
        short: "VAS",
        colors: ["#000000", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/133.png"
      },
      {
        name: "São Paulo F.C.",
        short: "SAO",
        colors: ["#C4122F", "#000000"],
        logo: "https://media.api-sports.io/football/teams/126.png"
      }
    ]
  },

  argentina_mls: {
    id: "argentina_mls",
    name: "Argentina & MLS",
    type: "club",
    region: "Amerika",
    badgeColor: "#0284c7",
    teams: [
      {
        name: "A.A. Argentinos Juniors",
        short: "ARG",
        colors: ["#DA291C", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/450.png"
      },
      {
        name: "C.A. Barracas Central",
        short: "BAR",
        colors: ["#E30613", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/2432.png"
      },
      {
        name: "C.A. Belgrano",
        short: "BEL",
        colors: ["#6CA0DC", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/448.png"
      },
      {
        name: "C.A. Boca Juniors",
        short: "BOC",
        colors: ["#003B70", "#FDC116"],
        logo: "https://media.api-sports.io/football/teams/451.png"
      },
      {
        name: "Club Estudiantes de La Plata",
        short: "EST",
        colors: ["#DA291C", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/452.png"
      },
      {
        name: "C.A. Rosario Central",
        short: "ROS",
        colors: ["#003366", "#FFCC00"],
        logo: "https://media.api-sports.io/football/teams/436.png"
      },
      {
        name: "Inter Miami CF",
        short: "MIA",
        colors: ["#F7B5CD", "#231F20"],
        logo: "https://media.api-sports.io/football/teams/9568.png"
      }
    ]
  },

  arab: {
    id: "arab",
    name: "Arab",
    type: "club",
    region: "Asia",
    badgeColor: "#b45309",
    teams: [
      {
        name: "Al-Hilal SFC",
        short: "HIL",
        colors: ["#0054A6", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/2939.png"
      },
      {
        name: "Al-Duhail SC",
        short: "DUH",
        colors: ["#C4122F", "#808080"],
        logo: "https://media.api-sports.io/football/teams/3412.png"
      },
      {
        name: "Al-Ahli Saudi FC",
        short: "AHL",
        colors: ["#007A3D", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/2932.png"
      },
      {
        name: "Al-Sadd SC",
        short: "SAD",
        colors: ["#000000", "#FFFFFF"],
        logo: "https://media.api-sports.io/football/teams/3410.png"
      },
      {
        name: "Al-Ittihad Club",
        short: "ITT",
        colors: ["#FEE100", "#000000"],
        logo: "https://media.api-sports.io/football/teams/2938.png"
      },
      {
        name: "Al-Nassr FC",
        short: "NAS",
        colors: ["#FFF200", "#005BAC"],
        logo: "https://media.api-sports.io/football/teams/2934.png"
      }
    ]
  },

  timnas_eropa: {
    id: "timnas_eropa",
    name: "Timnas Eropa",
    type: "nation",
    region: "Eropa",
    badgeColor: "#2563eb",
    teams: [
      {
        name: "Albania",
        short: "ALB",
        colors: ["#DA291C", "#000000"],
        logo: "https://flagcdn.com/w160/al.png"
      },
      {
        name: "Austria",
        short: "AUT",
        colors: ["#ED2939", "#FFFFFF"],
        logo: "https://flagcdn.com/w160/at.png"
      },
      {
        name: "Belgia",
        short: "BEL",
        colors: ["#ED2939", "#FCD116"],
        logo: "https://flagcdn.com/w160/be.png"
      },
      {
        name: "Kroasia",
        short: "CRO",
        colors: ["#FF0000", "#171796"],
        logo: "https://flagcdn.com/w160/hr.png"
      },
      {
        name: "Republik Ceko",
        short: "CZE",
        colors: ["#11457E", "#D7141A"],
        logo: "https://flagcdn.com/w160/cz.png"
      },
      {
        name: "Denmark",
        short: "DEN",
        colors: ["#C60C30", "#FFFFFF"],
        logo: "https://flagcdn.com/w160/dk.png"
      },
      {
        name: "Inggris",
        short: "ENG",
        colors: ["#FFFFFF", "#CE1124"],
        logo: "https://flagcdn.com/w160/gb-eng.png"
      },
      {
        name: "Prancis",
        short: "FRA",
        colors: ["#002654", "#ED2939"],
        logo: "https://flagcdn.com/w160/fr.png"
      },
      {
        name: "Georgia",
        short: "GEO",
        colors: ["#FF0000", "#FFFFFF"],
        logo: "https://flagcdn.com/w160/ge.png"
      },
      {
        name: "Jerman",
        short: "GER",
        colors: ["#FFFFFF", "#000000"],
        logo: "https://flagcdn.com/w160/de.png"
      },
      {
        name: "Yunani",
        short: "GRE",
        colors: ["#0D5EAF", "#FFFFFF"],
        logo: "https://flagcdn.com/w160/gr.png"
      },
      {
        name: "Hongaria",
        short: "HUN",
        colors: ["#CE2939", "#477050"],
        logo: "https://flagcdn.com/w160/hu.png"
      },
      {
        name: "Israel",
        short: "ISR",
        colors: ["#0038B8", "#FFFFFF"],
        logo: "https://flagcdn.com/w160/il.png"
      },
      {
        name: "Italia",
        short: "ITA",
        colors: ["#0064AA", "#FFFFFF"],
        logo: "https://flagcdn.com/w160/it.png"
      },
      {
        name: "Belanda",
        short: "NED",
        colors: ["#FF4F00", "#FFFFFF"],
        logo: "https://flagcdn.com/w160/nl.png"
      },
      {
        name: "Norwegia",
        short: "NOR",
        colors: ["#BA0C2F", "#00205B"],
        logo: "https://flagcdn.com/w160/no.png"
      },
      {
        name: "Polandia",
        short: "POL",
        colors: ["#DC143C", "#FFFFFF"],
        logo: "https://flagcdn.com/w160/pl.png"
      },
      {
        name: "Portugal",
        short: "POR",
        colors: ["#DA291C", "#046A38"],
        logo: "https://flagcdn.com/w160/pt.png"
      },
      {
        name: "Republik Irlandia",
        short: "IRL",
        colors: ["#169B62", "#FF883E"],
        logo: "https://flagcdn.com/w160/ie.png"
      },
      {
        name: "Rumania",
        short: "ROU",
        colors: ["#002B7F", "#FCD116"],
        logo: "https://flagcdn.com/w160/ro.png"
      },
      {
        name: "Rusia",
        short: "RUS",
        colors: ["#FFFFFF", "#0039A6"],
        logo: "https://flagcdn.com/w160/ru.png"
      },
      {
        name: "Skotlandia",
        short: "SCO",
        colors: ["#002B49", "#FFFFFF"],
        logo: "https://flagcdn.com/w160/gb-sct.png"
      },
      {
        name: "Serbia",
        short: "SRB",
        colors: ["#C6363C", "#0C4076"],
        logo: "https://flagcdn.com/w160/rs.png"
      },
      {
        name: "Slowakia",
        short: "SVK",
        colors: ["#0B3F7E", "#EE1C25"],
        logo: "https://flagcdn.com/w160/sk.png"
      },
      {
        name: "Spanyol",
        short: "ESP",
        colors: ["#AA151B", "#F1BF00"],
        logo: "https://flagcdn.com/w160/es.png"
      },
      {
        name: "Swedia",
        short: "SWE",
        colors: ["#006AA7", "#FECC00"],
        logo: "https://flagcdn.com/w160/se.png"
      },
      {
        name: "Swiss",
        short: "SUI",
        colors: ["#FF0000", "#FFFFFF"],
        logo: "https://flagcdn.com/w160/ch.png"
      },
      {
        name: "Turki",
        short: "TUR",
        colors: ["#E30A17", "#FFFFFF"],
        logo: "https://flagcdn.com/w160/tr.png"
      },
      {
        name: "Ukraina",
        short: "UKR",
        colors: ["#005BBB", "#FFD500"],
        logo: "https://flagcdn.com/w160/ua.png"
      },
      {
        name: "Wales",
        short: "WAL",
        colors: ["#D30731", "#00AB63"],
        logo: "https://flagcdn.com/w160/gb-wls.png"
      }
    ]
  },

  timnas_afrika: {
    id: "timnas_afrika",
    name: "Timnas Afrika",
    type: "nation",
    region: "Afrika",
    badgeColor: "#15803d",
    teams: [
      {
        name: "Aljazair",
        short: "ALG",
        colors: ["#006233", "#D21034"],
        logo: "https://flagcdn.com/w160/dz.png"
      },
      {
        name: "Kamerun",
        short: "CMR",
        colors: ["#007A5E", "#CE1126"],
        logo: "https://flagcdn.com/w160/cm.png"
      },
      {
        name: "R.D. Kongo",
        short: "COD",
        colors: ["#007FFF", "#FCD116"],
        logo: "https://flagcdn.com/w160/cd.png"
      },
      {
        name: "Mesir",
        short: "EGY",
        colors: ["#C8102E", "#000000"],
        logo: "https://flagcdn.com/w160/eg.png"
      },
      {
        name: "Pantai Gading",
        short: "CIV",
        colors: ["#F77F00", "#009E60"],
        logo: "https://flagcdn.com/w160/ci.png"
      },
      {
        name: "Ghana",
        short: "GHA",
        colors: ["#CE1126", "#FCD116"],
        logo: "https://flagcdn.com/w160/gh.png"
      },
      {
        name: "Maroko",
        short: "MAR",
        colors: ["#C1272D", "#006233"],
        logo: "https://flagcdn.com/w160/ma.png"
      },
      {
        name: "Nigeria",
        short: "NGA",
        colors: ["#008751", "#FFFFFF"],
        logo: "https://flagcdn.com/w160/ng.png"
      },
      {
        name: "Senegal",
        short: "SEN",
        colors: ["#00853F", "#FDEF42"],
        logo: "https://flagcdn.com/w160/sn.png"
      }
    ]
  },

  timnas_amerika: {
    id: "timnas_amerika",
    name: "Timnas Amerika",
    type: "nation",
    region: "Amerika",
    badgeColor: "#c026d3",
    teams: [
      {
        name: "Kanada",
        short: "CAN",
        colors: ["#FF0000", "#FFFFFF"],
        logo: "https://flagcdn.com/w160/ca.png"
      },
      {
        name: "Jamaika",
        short: "JAM",
        colors: ["#009B3A", "#FED100"],
        logo: "https://flagcdn.com/w160/jm.png"
      },
      {
        name: "Meksiko",
        short: "MEX",
        colors: ["#006847", "#CE1126"],
        logo: "https://flagcdn.com/w160/mx.png"
      },
      {
        name: "Amerika Serikat",
        short: "USA",
        colors: ["#002868", "#BF0A30"],
        logo: "https://flagcdn.com/w160/us.png"
      },
      {
        name: "Argentina",
        short: "ARG",
        colors: ["#74ACDF", "#FFFFFF"],
        logo: "https://flagcdn.com/w160/ar.png"
      },
      {
        name: "Brasil",
        short: "BRA",
        colors: ["#FED100", "#009739"],
        logo: "https://flagcdn.com/w160/br.png"
      },
      {
        name: "Chili",
        short: "CHI",
        colors: ["#D52B1E", "#0039A6"],
        logo: "https://flagcdn.com/w160/cl.png"
      },
      {
        name: "Kolombia",
        short: "COL",
        colors: ["#FCD116", "#003893"],
        logo: "https://flagcdn.com/w160/co.png"
      },
      {
        name: "Ekuador",
        short: "ECU",
        colors: ["#FFD100", "#0033A0"],
        logo: "https://flagcdn.com/w160/ec.png"
      },
      {
        name: "Paraguay",
        short: "PAR",
        colors: ["#D52B1E", "#0038A8"],
        logo: "https://flagcdn.com/w160/py.png"
      },
      {
        name: "Uruguay",
        short: "URU",
        colors: ["#55B5E6", "#FFFFFF"],
        logo: "https://flagcdn.com/w160/uy.png"
      },
      {
        name: "Venezuela",
        short: "VEN",
        colors: ["#670E36", "#FED100"],
        logo: "https://flagcdn.com/w160/ve.png"
      }
    ]
  },

  timnas_asia_oseania: {
    id: "timnas_asia_oseania",
    name: "Timnas Asia & Oseania",
    type: "nation",
    region: "Asia & Oseania",
    badgeColor: "#ea580c",
    teams: [
      {
        name: "Indonesia",
        short: "INA",
        colors: ["#FF0000", "#FFFFFF"],
        logo: "https://flagcdn.com/w160/id.png"
      },
      {
        name: "Jepang",
        short: "JPN",
        colors: ["#00205B", "#FFFFFF"],
        logo: "https://flagcdn.com/w160/jp.png"
      },
      {
        name: "Korea Selatan",
        short: "KOR",
        colors: ["#EA1D2C", "#0047A0"],
        logo: "https://flagcdn.com/w160/kr.png"
      },
      {
        name: "Selandia Baru",
        short: "NZL",
        colors: ["#000000", "#FFFFFF"],
        logo: "https://flagcdn.com/w160/nz.png"
      },
      {
        name: "Thailand",
        short: "THA",
        colors: ["#A51931", "#2D2A4A"],
        logo: "https://flagcdn.com/w160/th.png"
      },
      {
        name: "Arab Saudi",
        short: "KSA",
        colors: ["#006C35", "#FFFFFF"],
        logo: "https://flagcdn.com/w160/sa.png"
      },
      {
        name: "Qatar",
        short: "QAT",
        colors: ["#8A1538", "#FFFFFF"],
        logo: "https://flagcdn.com/w160/qa.png"
      },
      {
        name: "Australia",
        short: "AUS",
        colors: ["#00843D", "#FFCD00"],
        logo: "https://flagcdn.com/w160/au.png"
      }
    ]
  }
};

// Default fallback logo jika gambar eksternal gagal dimuat
const DEFAULT_FALLBACK_LOGO = "https://cdn-icons-png.flaticon.com/512/53/53283.png";

// Helper fungsi untuk mendapatkan daftar semua tim secara flattened
function getAllTeamsList() {
  const all = [];
  Object.values(TEAMS_DATABASE).forEach(category => {
    category.teams.forEach(team => {
      all.push({
        ...team,
        categoryId: category.id,
        categoryName: category.name,
        categoryType: category.type,
        region: category.region
      });
    });
  });
  return all;
}

// Mengekspos ke window untuk akses modular di app.js
window.TEAMS_DATABASE = TEAMS_DATABASE;
window.DEFAULT_FALLBACK_LOGO = DEFAULT_FALLBACK_LOGO;
window.getAllTeamsList = getAllTeamsList;
