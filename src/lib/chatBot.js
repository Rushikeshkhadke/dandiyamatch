// Interactive Festive Garba Chat Reply Generator for DandiyaMatch 2026

export const generatePartnerGarbaReply = (partner, text = '') => {
  const lower = text.toLowerCase();
  const partnerName = partner?.naam ? partner.naam.split(' ')[0] : 'Partner';
  const city = partner?.city || 'City';
  const event = partner?.event_pin || '';

  if (lower.includes('pass') || lower.includes('ticket') || lower.includes('entry') || lower.includes('booking')) {
    return event
      ? `Mere paas ${event} ka Season Pass ready hai! Tumne pass book kar liya ya abhi planning chal rahi hai? 🎟️✨`
      : `Mere paas Day 1 to 9 ka Season Pass ready hai! Tumhara pass confirm ho gaya? 🎟️✨`;
  }

  if (lower.includes('step') || lower.includes('taali') || lower.includes('dance') || lower.includes('sikha') || lower.includes('sikho')) {
    return `Haha main ${partner?.dancing_level || 'Intermediate'} dancer hu! 3-taali, heench aur dodhiya steps acchi tarah aate hain 💃 Saath mein circle banayenge!`;
  }

  if (
    lower.includes('color') ||
    lower.includes('outfit') ||
    lower.includes('pehna') ||
    lower.includes('dress') ||
    lower.includes('chaniya') ||
    lower.includes('kurta') ||
    lower.includes('matching')
  ) {
    return `Maine bright traditional Navratri colors select kiye hain (Yellow & Maroon)! Tumhara kurta/chaniya choli match karenge to apni Jodi sabse best dikhegi! ✨🥻`;
  }

  if (
    lower.includes('kaha') ||
    lower.includes('where') ||
    lower.includes('venue') ||
    lower.includes('ground') ||
    lower.includes('location') ||
    lower.includes('aoge')
  ) {
    return `${city} ke ground pe iss saal dhoom machne wali hai! ${event ? event + ' pe ' : ''}raat 9:30 PM tak milte hain? 🎪🪔`;
  }

  if (lower.includes('time') || lower.includes('kab') || lower.includes('baje') || lower.includes('timing')) {
    return `Aarti 9:30 baje shuru hoti hai aur 10:00 baje se heavy dhol beats shuru ho jaati hain! Time pe ground pahuch jana ⏰🎊`;
  }

  if (
    lower.includes('hi') ||
    lower.includes('hello') ||
    lower.includes('hey') ||
    lower.includes('kem cho') ||
    lower.includes('namaste')
  ) {
    return `Kem Cho! 🎊 DandiyaMatch par connect karke bahut achha laga! Iss Navratri 2026 dhol pe saath mein Garba ghumiye! 💃✨`;
  }

  if (lower.includes('ghumiye') || lower.includes('garba') || lower.includes('dandiya') || lower.includes('chalo')) {
    return `Chalo Garba Ghumiye! 🪔 Apni Dandiya sticks ready rakhna, raat 2 baje tak ground nahi chhodenge! 💃🕺`;
  }

  if (lower.includes('song') || lower.includes('music') || lower.includes('gaana') || lower.includes('dhol')) {
    return `Mujhe 'Sanedo', 'Chogada Tara' aur 'Dholida' sunte hi full energetic vibe aa jaati hai! Tumhara favorite konsa hai? 🎶🥁`;
  }

  const defaultReplies = [
    `Arey waah! 🎊 Navratri 2026 mein mast Garba circle banayenge! Tumhara favorite Garba song konsa hai? 🎶`,
    `Super excited! ${city} ki energy Navratri mein sabse best hoti hai! Dhol sunke goosebumps aate hain 💃`,
    `Bilkul! Dandiya sticks ready rakhna, raat 2 baje tak ground pe non-stop dhoom machayenge! 🪔✨`,
    `Perfect! Humari Jodi iss ground pe sabse zyada swirl karegi! See you at the Garba circle! 🎊`,
  ];

  return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
};
