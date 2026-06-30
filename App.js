import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

const AWAKEN_LINE = 'The child of Bhaal has awoken';
const STIR_LINE = 'The Absolute calls to you…';

export default function App() {
  // Opacity of the main line, driven from 0 -> 1 on launch (the awakening).
  const awaken = useRef(new Animated.Value(0)).current;
  // Opacity of the second line, revealed on first tap (the stirring).
  const stir = useRef(new Animated.Value(0)).current;
  // Scale of the whole scene, briefly pulsed on every tap.
  const pulse = useRef(new Animated.Value(1)).current;
  const [stirred, setStirred] = useState(false);

  // On mount: slowly fade the main line in, as if waking.
  useEffect(() => {
    Animated.timing(awaken, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: true,
    }).start();
  }, [awaken]);

  const onTap = () => {
    // A buzz from the dark.
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // First tap reveals the second line; later taps just pulse.
    if (!stirred) {
      setStirred(true);
      Animated.timing(stir, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start();
    }

    // A quick swell and settle.
    Animated.sequence([
      Animated.timing(pulse, { toValue: 1.06, duration: 120, useNativeDriver: true }),
      Animated.spring(pulse, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
  };

  return (
    <Pressable style={styles.container} onPress={onTap}>
      <Animated.View style={{ transform: [{ scale: pulse }], alignItems: 'center' }}>
        <Animated.Text style={[styles.awaken, { opacity: awaken }]}>
          {AWAKEN_LINE}
        </Animated.Text>
        <Animated.Text style={[styles.stir, { opacity: stir }]}>
          {STIR_LINE}
        </Animated.Text>
      </Animated.View>
      <StatusBar style="light" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08060a', // near-black, faint violet undertone
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  awaken: {
    color: '#b3121b', // blood red
    fontSize: 28,
    fontWeight: '700',
    fontStyle: 'italic',
    textAlign: 'center',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(179, 18, 27, 0.65)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14, // the unholy glow
  },
  stir: {
    color: '#6e5a73', // muted, ghostlike
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: 22,
  },
});
