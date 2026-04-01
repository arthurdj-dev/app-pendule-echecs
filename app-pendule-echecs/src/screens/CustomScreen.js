import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function CustomScreen({ navigation }) {
  const { theme } = useTheme();
  const s = styles(theme);

  const [minW, setMinW] = useState('10');
  const [secW, setSecW] = useState('0');
  const [minB, setMinB] = useState('10');
  const [secB, setSecB] = useState('0');
  const [inc,  setInc]  = useState('0');
  const [sym,  setSym]  = useState(true);

  const start = () => {
    const tw = (parseInt(minW) || 0) * 60 + (parseInt(secW) || 0);
    const tb = sym ? tw : (parseInt(minB) || 0) * 60 + (parseInt(secB) || 0);
    if (tw === 0) return;
    navigation.navigate('Game', {
      timeWhite: tw, timeBlack: tb, increment: parseInt(inc) || 0,
    });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={s.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Text style={s.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={s.title}>Temps personnalisé</Text>

        <Text style={s.label}>Joueur 1</Text>
        <View style={s.row}>
          <TextInput style={s.input} value={minW} onChangeText={v => { setMinW(v); if (sym) setMinB(v); }} keyboardType="number-pad" placeholder="min" placeholderTextColor={theme.subtext} />
          <Text style={s.sep}>:</Text>
          <TextInput style={s.input} value={secW} onChangeText={v => { setSecW(v); if (sym) setSecB(v); }} keyboardType="number-pad" placeholder="sec" placeholderTextColor={theme.subtext} />
        </View>

        <TouchableOpacity style={s.symBtn} onPress={() => setSym(!sym)}>
          <Text style={s.symText}>{sym ? '🔒 Symétrique' : '🔓 Asymétrique'}</Text>
        </TouchableOpacity>

        {!sym && (
          <>
            <Text style={s.label}>Joueur 2</Text>
            <View style={s.row}>
              <TextInput style={s.input} value={minB} onChangeText={setMinB} keyboardType="number-pad" placeholder="min" placeholderTextColor={theme.subtext} />
              <Text style={s.sep}>:</Text>
              <TextInput style={s.input} value={secB} onChangeText={setSecB} keyboardType="number-pad" placeholder="sec" placeholderTextColor={theme.subtext} />
            </View>
          </>
        )}

        <Text style={s.label}>Incrément (secondes)</Text>
        <TextInput style={s.input} value={inc} onChangeText={setInc} keyboardType="number-pad" placeholder="0" placeholderTextColor={theme.subtext} />

        <TouchableOpacity style={s.startBtn} onPress={start}>
          <Text style={s.startText}>Lancer la partie</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = (t) => StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 56 },
  back:      { marginBottom: 16 },
  backText:  { color: t.accent, fontSize: 16 },
  title:     { fontSize: 24, fontWeight: '700', color: t.text, marginBottom: 28 },
  label:     { fontSize: 13, fontWeight: '600', color: t.subtext, marginBottom: 8, marginTop: 20, textTransform: 'uppercase', letterSpacing: 1 },
  row:       { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input:     { backgroundColor: t.card, borderRadius: 10, padding: 14, fontSize: 20, fontWeight: '600', color: t.text, width: 80, textAlign: 'center' },
  sep:       { fontSize: 24, fontWeight: '700', color: t.text },
  symBtn:    { marginTop: 16, padding: 12, borderRadius: 10, backgroundColor: t.card, alignSelf: 'flex-start' },
  symText:   { color: t.text, fontSize: 14 },
  startBtn:  { backgroundColor: t.accent, borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 40 },
  startText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
});