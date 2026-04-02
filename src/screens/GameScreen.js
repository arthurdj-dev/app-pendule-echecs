import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
  const [active, setActive] = useState(null);
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

  // Reset propre quand on quitte l'écran (bouton retour Android)
  useFocusEffect(
    useCallback(() => {
      return () => {
        stopInterval();
        setTimes([timeWhite, timeBlack]);
        setActive(null);
        setPaused(false);
        setMoves([0, 0]);
        setOver(false);
      };
    }, [])
  );

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

    if (active === null) {
      const next = player === 0 ? 1 : 0;
      setActive(next);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return;
    }

    if (active !== player) return;

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

  const s = styles(theme);

  const renderZone = (player) => {
    const isActive  = active === player && !paused && !over;
    const isUrgent  = times[player] <= 10 && times[player] > 0;
    const isDead    = over && times[player] === 0;
    const isWinner  = over && times[player] > 0;
    const flipped   = player === 0;

    return (
      <TouchableOpacity
        style={[
          s.zone,
          isActive  && s.zoneActive,
          isDead    && s.zoneDead,
          isWinner  && s.zoneWinner,
          !isActive && !isDead && !isWinner && active !== null && s.zoneInactive,
        ]}
        onPress={() => handlePress(player)}
        activeOpacity={0.85}
      >
        <View style={[s.zoneInner, flipped && { transform: [{ rotate: '180deg' }] }]}>
          {isDead ? (
            <>
              <Text style={s.flag}>🏳️</Text>
              <Text style={s.timerDead}>00:00</Text>
              <Text style={s.loserLabel}>Temps écoulé</Text>
            </>
          ) : (
            <>
              <Text style={[s.timer, isUrgent && s.timerUrgent, isWinner && s.timerWinner]}>
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
              {isWinner && (
                <Text style={s.hint}>🏆 Victoire !</Text>
              )}
            </>
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
  zoneWinner:    { backgroundColor: '#1B5E20' },
  zoneInner:     { alignItems: 'center', gap: 8 },
  timer:         { fontSize: 72, fontWeight: '300', color: t.text, fontVariant: ['tabular-nums'] },
  timerUrgent:   { color: t.urgent, fontWeight: '600' },
  timerDead:     { fontSize: 72, fontWeight: '300', color: '#FFFFFF' },
  timerWinner:   { color: '#FFFFFF' },
  loserLabel:    { fontSize: 16, color: '#FFCDD2', marginTop: 8 },
  flag:          { fontSize: 48, marginBottom: 8 },
  moves:         { fontSize: 16, color: t.subtext },
  movesActive:   { color: t.text },
  hint:          { fontSize: 13, color: t.subtext, marginTop: 8 },
  controls:      { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24, paddingVertical: 12, backgroundColor: t.bg, zIndex: 10 },
  ctrl:          { width: 48, height: 48, borderRadius: 24, backgroundColor: t.card, justifyContent: 'center', alignItems: 'center' },
  ctrlText:      { fontSize: 20, color: t.text },
});