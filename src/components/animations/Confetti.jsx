import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function Confetti({ active = true }) {
  useEffect(() => {
    if (!active) return;

    // First burst - from both sides
    const count = 180;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#FFD700', '#FF4D00', '#D90429', '#FFE566', '#FF9900', '#FFF5E4'],
      shapes: ['circle', 'square'],
      scalar: 1.1,
    };

    const fire = (particleRatio, opts) => {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    };

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });

    // Continuous soft golden rain for 2 seconds
    const end = Date.now() + 1800;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.3 },
        colors: ['#FFD700', '#FF4D00', '#FFE566'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.3 },
        colors: ['#FFD700', '#D90429', '#FF9900'],
      });
    }, 150);

    return () => clearInterval(interval);
  }, [active]);

  return null;
}
