import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text, TouchableOpacity,
    View
} from 'react-native';
import { PRESETS } from '../constants/presets';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen({ navigation }) {
  const { theme, toggle } = useTheme();
  const s = styles(theme);

  return (
    <View style={s.container}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />

      <View style={s.header}>
        <Text style={s.title}>Pendule</Text>
        <Switch value={theme.dark} onValueChange={toggle} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {PRESETS.map(group => (
          <View key={group.label}>
            <Text style={s.groupLabel}>{group.label}</Text>
            <View style={s.row}>
              {group.modes.map(mode => (
                <TouchableOpacity
                  key={mode.name}
                  style={s.card}
                  onPress={() => navigation.navigate('Game', {
                    timeWhite: mode.time,
                    timeBlack: mode.time,
                    increment: mode.increment,
                  })}
                >
                  <Text style={s.cardName}>{mode.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={s.customBtn}
          onPress={() => navigation.navigate('Custom')}
        >
          <Text style={s.customText}>⚙️  Personnalisé</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = (t) => StyleSheet.create({
  container:   { flex: 1, backgroundColor: t.bg, paddingHorizontal: 20, paddingTop: 56 },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  title:       { fontSize: 28, fontWeight: '700', color: t.text },
  groupLabel:  { fontSize: 13, fontWeight: '600', color: t.subtext, marginBottom: 10, marginTop: 16, textTransform: 'uppercase', letterSpacing: 1 },
  row:         { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card:        { backgroundColor: t.card, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 20, minWidth: 100 },
  cardName:    { fontSize: 16, fontWeight: '600', color: t.text },
  customBtn:   { backgroundColor: t.card, borderRadius: 12, padding: 18, alignItems: 'center', marginTop: 24, marginBottom: 40 },
  customText:  { fontSize: 16, fontWeight: '600', color: t.text },
});