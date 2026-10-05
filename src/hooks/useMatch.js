import { useStore } from '../store/useStore';

export function useMatch() {
  const {
    currentMatch,
    isEventMatch,
    findNextMatch,
    passCurrentMatch,
    connectCurrentMatch,
    reportCurrentMatch,
    resetMatches,
  } = useStore();

  return {
    currentMatch,
    isEventMatch,
    findNextMatch,
    pass: passCurrentMatch,
    connect: connectCurrentMatch,
    report: reportCurrentMatch,
    resetMatches,
  };
}
