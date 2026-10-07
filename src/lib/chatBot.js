// Interactive Festive Garba Chat Reply Generator for DandiyaMatch 2026

export const generatePartnerGarbaReply = (partner, text = '') => {
  const lower = text.toLowerCase();
  const partnerName = partner?.naam ? partner.naam.split(' ')[0] : 'Partner';
  const city = partner?.city || 'City';
  const event = partner?.event_pin || '';
  const isFemale = partner?.gender === 'Female';
  const doSuffix = isFemale ? 'lungi' : 'lunga';
  const aungiSuffix = isFemale ? 'aaungi' : 'aaunga';
  const karungiSuffix = isFemale ? 'karungi' : 'karunga';

  const instaHandle = partner?.instagram || `${partnerName.toLowerCase()}_garba2026`;
  const waNumber = partner?.whatsapp || '9823011223';

  // 1. Social Exchange - Instagram handle request
  if (
    lower.includes('insta') ||
    lower.includes('instagram') ||
    lower.includes('handle') ||
    lower.includes('ig') ||
    lower.includes('id do') ||
    lower.includes('id batao') ||
    lower.includes('profile')
  ) {
    return `Haan bilkul! Mera Insta handle @${instaHandle} hai 📸 Tum follow request bhej do ya DM kar do, main accept kar ${doSuffix}! Outfits aur passes ki stories wahi share karte hain ✨`;
  }

  // 2. Social Exchange - Phone / WhatsApp number request
  if (
    lower.includes('number') ||
    lower.includes('whatsapp') ||
    lower.includes('phone') ||
    lower.includes('contact') ||
    lower.includes('call') ||
    lower.includes('wa pe') ||
    lower.includes('wa number')
  ) {
    return `Haan sure! Ye lo mera WhatsApp number: +91 ${waNumber} 📱 Ground pe live location coordinate karne ke liye text kar lena! 🪔`;
  }

  // 3. Social Exchange - Both / Exchange together
  if (
    lower.includes('exchange') ||
    lower.includes('social') ||
    lower.includes('dono') ||
    lower.includes('details') ||
    lower.includes('share') && (lower.includes('insta') || lower.includes('number'))
  ) {
    return `Zaroor! Mera Insta handle @${instaHandle} hai aur WhatsApp number +91 ${waNumber} hai 📱📸 Dono pe connect ho jaate hain taaki plan lock ho sake!`;
  }

  // 4. Passes & Tickets
  if (
    lower.includes('pass') ||
    lower.includes('ticket') ||
    lower.includes('entry') ||
    lower.includes('booking') ||
    lower.includes('gate')
  ) {
    return event
      ? `Mere paas ${event} ka Season Pass already ready hai! Tumne pass book kar liya ya abhi planning chal rahi hai? 🎟️✨`
      : `Mere paas Day 1 to 9 ka Season Pass ready hai! Tumhara pass confirm ho gaya? 🎟️✨`;
  }

  // 5. Dance steps & styles
  if (
    lower.includes('step') ||
    lower.includes('taali') ||
    lower.includes('dance') ||
    lower.includes('sikha') ||
    lower.includes('sikho') ||
    lower.includes('heench') ||
    lower.includes('dodhiya')
  ) {
    return `Haha main ${partner?.dancing_level || 'Intermediate'} dancer hu! 3-taali, heench aur dodhiya steps acchi tarah aate hain 💃 Saath mein circular spin lagayenge!`;
  }

  // 6. Outfit & Color matching
  if (
    lower.includes('color') ||
    lower.includes('outfit') ||
    lower.includes('pehna') ||
    lower.includes('dress') ||
    lower.includes('chaniya') ||
    lower.includes('kurta') ||
    lower.includes('matching') ||
    lower.includes('pehnoge')
  ) {
    return `Maine bright traditional Navratri colors select kiye hain (Yellow & Maroon)! Tumhara kurta/chaniya choli match karenge to apni Jodi ground pe sabse standout karegi! ✨🥻`;
  }

  // 7. Venue / Location / Where to meet
  if (
    lower.includes('kaha') ||
    lower.includes('where') ||
    lower.includes('venue') ||
    lower.includes('ground') ||
    lower.includes('location') ||
    lower.includes('aoge') ||
    lower.includes('milna') ||
    lower.includes('milenge')
  ) {
    return `${city} ke ground pe iss saal sabse heavy dhol beats hone wali hain! ${event ? event + ' pe ' : ''}raat 9:30 PM tak main pahuch ${aungiSuffix}, entry gate 2 pe milte hain? 🎪🪔`;
  }

  // 8. Timings
  if (
    lower.includes('time') ||
    lower.includes('kab') ||
    lower.includes('baje') ||
    lower.includes('timing')
  ) {
    return `Aarti 9:30 baje shuru hoti hai aur 10:00 baje se heavy dhol beats shuru ho jaati hain! Raat 2:00 AM tak non-stop Garba chalega ⏰🎊 Time pe aa jana!`;
  }

  // 9. Greetings & Casual Hello
  if (
    lower.includes('hi') ||
    lower.includes('hello') ||
    lower.includes('hey') ||
    lower.includes('kem cho') ||
    lower.includes('namaste') ||
    lower.includes('kaise') ||
    lower.includes('kya haal')
  ) {
    return `Kem Cho! 🎊 Main bilkul badhiya hu! DandiyaMatch par connect karke bahut achha laga. Iss Navratri 2026 dhol beats pe saath mein Garba ghumiye! 💃✨`;
  }

  // 10. Songs & Music
  if (
    lower.includes('song') ||
    lower.includes('music') ||
    lower.includes('gaana') ||
    lower.includes('dhol') ||
    lower.includes('chogada') ||
    lower.includes('sanedo')
  ) {
    return `Mujhe 'Sanedo', 'Chogada Tara', 'Kamariya' aur 'Dholida' sunte hi goosebumps aa jaate hain! Tumhara favorite Garba track konsa hai? 🎶🥁`;
  }

  // 11. Food / Snacks after Garba
  if (
    lower.includes('khana') ||
    lower.includes('fafda') ||
    lower.includes('jalebi') ||
    lower.includes('chai') ||
    lower.includes('food') ||
    lower.includes('bhukh')
  ) {
    return `Garba ke baad raat 2 baje garam fafda-jalebi aur kadak chai toh mandatory ritual hai! Ground ke bahar stall pe saath chalenge ☕😋`;
  }

  // 12. Dandiya sticks
  if (
    lower.includes('dandiya') ||
    lower.includes('stick') ||
    lower.includes('ghumiye') ||
    lower.includes('chalo')
  ) {
    return `Chalo Garba Ghumiye! 🪔 Apni colourful Dandiya sticks ready rakhna, round start hote hi full coordination se strike karenge! 💃🕺`;
  }

  // 13. Compliments
  if (
    lower.includes('mast') ||
    lower.includes('achhi') ||
    lower.includes('achha') ||
    lower.includes('nice') ||
    lower.includes('cute') ||
    lower.includes('sundar') ||
    lower.includes('photo')
  ) {
    return `Aww thank you so much! 😊 Aapki profile vibe bhi super energetic hai, ground pe Jodi sach me rocking lagegi! ✨`;
  }

  // Default natural replies
  const defaultReplies = [
    `Arey waah! 🎊 Navratri 2026 mein mast Garba circle banayenge! Tumhara favorite Garba song konsa hai? 🎶`,
    `Super excited! ${city} ki energy Navratri mein sabse best hoti hai! Dhol sunke adrenaline rush aa jata hai 💃`,
    `Bilkul! Dandiya sticks ready rakhna, raat 2 baje tak ground pe non-stop dhoom machayenge! 🪔✨`,
    `Perfect! Humari Jodi iss ground pe sabse zyada swirl karegi! See you at the Garba circle! 🎊`,
    `Mast! Hum dono ka vibe ekdum match ho raha hai! Outfits aur timings coordinate kar lete hain 🥻💃`,
  ];

  return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
};
