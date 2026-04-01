import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    Text, TouchableOpacity,
    Vibration,
    View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const fmt = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

export default function GameScreen({ route, navigation }) {
  const { timeWhite, timeBlack, increment } = route.params;
  const { theme } = useTheme();

  const [times, setTimes]   = useState([timeWhite, timeBlack]);
  const [active, setActive] = useState(null);   // null = pas commencé, 0 ou 1
  const [paused, setPaused] = useState(false);
  const [moves,  setMoves]  = useState([0, 0]);
  const [over,   setOver]   = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    activateKeepAwakeAsync();
    return () => deactivateKeepAwake();
  }, []);

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startInterval = useCallback((player) => {
    stopInterval();
    intervalRef.current = setInterval(() => {
      setTimes(prev => {
        const next = [...prev];
        next[player] = Math.max(0, next[player] - 1);
        if (next[player] === 0) {
          stopInterval();
          setOver(true);
          Vibration.vibrate([0, 400, 200, 400]);
        }
        return next;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    if (active !== null && !paused && !over) {
      startInterval(active);
    } else {
      stopInterval();
    }
    return stopInterval;
  }, [active, paused, over]);

  const handlePress = (player) => {
    if (over) return;
    if (paused) return;

    // Premier coup : joueur 0 appuie pour lancer le timer de joueur 1, etc.
    if (active === null) {
      // Le joueur qui appuie passe la main à l'adversaire
      const next = player === 0 ? 1 : 0;
      setActive(next);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return;
    }

    // Seulement le joueur actif peut appuyer
    if (active !== player) return;

    // Incrément Fischer
    setTimes(prev => {
      const next = [...prev];
      next[player] = next[player] + increment;
      return next;
    });

    setMoves(prev => {
      const next = [...prev];
      next[player] = next[player] + 1;
      return next;
    });

    const next = player === 0 ? 1 : 0;
    setActive(next);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handlePause = () => {
    if (active === null || over) return;
    setPaused(p => !p);
  };

  const handleReset = () => {
    stopInterval();
    setTimes([timeWhite, timeBlack]);
    setActive(null);
    setPaused(false);
    setMoves([0, 0]);
    setOver(false);
  };

  useEffect(() => {
    if (over) {
      const loser = times[0] === 0 ? 0 : 1;
      const winner = loser === 0 ? 1 : 0;
      setTimeout(() => {
        navigation.replace('End', {
          winner,
          timeLeft: times[winner],
          moves,
          timeWhite,
          timeBlack,
          increment,
        });
      }, 1200);
    }
  }, [over]);

  const s = styles(theme);

  const renderZone = (player) => {
    const isActive  = active === player && !paused && !over;
    const isUrgent  = times[player] <= 10 && times[player] > 0;
    const isDead    = times[player] === 0;
    const flipped   = player === 0;

    return (
      <TouchableOpacity
        style={[
          s.zone,
          isActive  && s.zoneActive,
          isDead    && s.zoneDead,
          !isActive && active !== null && !isDead && s.zoneInactive,
        ]}
        onPress={() => handlePress(player)}
        activeOpacity={0.85}
      >
        <View style={[s.zoneInner, flipped && { transform: [{ rotate: '180deg' }] }]}>
          <Text style={[s.timer, isUrgent && s.timerUrgent, isDead && s.timerDead]}>
            {fmt(times[player])}
          </Text>
          <Text style={[s.moves, isActive && s.movesActive]}>
            {moves[player]} coup{moves[player] !== 1 ? 's' : ''}
          </Text>
          {active === null && (
            <Text style={s.hint}>Appuyez pour commencer</Text>
          )}
          {isActive && (
            <Text style={s.hint}>À vous de jouer</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={s.container}>
      {renderZone(0)}

      <View style={s.controls}>
        <TouchableOpacity style={s.ctrl} onPress={handleReset}>
          <Text style={s.ctrlText}>↺</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.ctrl} onPress={handlePause}>
          <Text style={s.ctrlText}>{paused ? '▶' : '⏸'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.ctrl} onPress={() => navigation.navigate('Home')}>
          <Text style={s.ctrlText}>✕</Text>
        </TouchableOpacity>
      </View>

      {renderZone(1)}
    </View>
  );
}

const styles = (t) => StyleSheet.create({
  container:     { flex: 1, backgroundColor: t.bg },
  zone:          { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: t.card },
  zoneActive:    { backgroundColor: t.active },
  zoneInactive:  { backgroundColor: t.inactive, opacity: 0.6 },
  zoneDead:      { backgroundColor: '#B71C1C' },
  zoneInner:     { alignItems: 'center', gap: 8 },
  timer:         { fontSize: 72, fontWeight: '300', color: t.text, fontVariant: ['tabular-nums'] },
  timerUrgent:   { color: t.urgent, fontWeight: '600' },
  timerDead:     { color: '#FFFFFF' },
  moves:         { fontSize: 16, color: t.subtext },
  movesActive:   { color: t.text },
  hint:          { fontSize: 13, color: t.subtext, marginTop: 8 },
  controls:      { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24, paddingVertical: 12, backgroundColor: t.bg, zIndex: 10 },
  ctrl:          { width: 48, height: 48, borderRadius: 24, backgroundColor: t.card, justifyContent: 'center', alignItems: 'center' },
  ctrlText:      { fontSize: 20, color: t.text },
});