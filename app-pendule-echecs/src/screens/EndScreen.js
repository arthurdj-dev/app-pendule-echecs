import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const fmt = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

export default function EndScreen({ route, navigation }) {
  const { winner, timeLeft, moves, timeWhite, timeBlack, increment } = route.params;
  const { theme } = useTheme();
  const s = styles(theme);
  const totalMoves = moves[0] + moves[1];

  return (
    <View style={s.container}>
      <Text style={s.emoji}>♟️</Text>
      <Text style={s.winner}>Joueur {winner + 1} gagne !</Text>
      <Text style={s.sub}>Temps restant : {fmt(timeLeft)}</Text>
      <Text style={s.sub}>Nombre de coups : {totalMoves}</Text>

      <TouchableOpacity
        style={s.btn}
        onPress={() => navigation.replace('Game', { timeWhite, timeBlack, increment })}
      >
        <Text style={s.btnText}>Rejouer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[s.btn, s.btnSecondary]}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={[s.btnText, { color: theme.text }]}>Menu principal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = (t) => StyleSheet.create({
  container:   { flex: 1, backgroundColor: t.bg, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emoji:       { fontSize: 64, marginBottom: 16 },
  winner:      { fontSize: 32, fontWeight: '700', color: t.text, marginBottom: 8 },
  sub:         { fontSize: 16, color: t.subtext, marginBottom: 6 },
  btn:         { backgroundColor: t.accent, borderRadius: 14, padding: 18, width: '100%', alignItems: 'center', marginTop: 32 },
  btnSecondary:{ backgroundColor: t.card, marginTop: 12 },
  btnText:     { color: '#FFF', fontSize: 18, fontWeight: '700' },
});