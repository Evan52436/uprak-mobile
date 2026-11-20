import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ToastMessage } from '../models/types';
import { AppTheme } from '../constants/theme';

interface ToastProps {
  toast: ToastMessage | null;
  theme: AppTheme;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, theme, onDismiss }) => {
  const { colors, radii, shadows } = theme;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.delay(2800),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onDismiss();
      });
    }
  }, [toast]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isDanger = toast.type === 'danger';
  const isWarning = toast.type === 'warning';

  const iconName: keyof typeof Ionicons.glyphMap = isSuccess
    ? 'checkmark-circle'
    : isDanger
    ? 'close-circle'
    : isWarning
    ? 'warning'
    : 'information-circle';

  const accentColor = isSuccess
    ? colors.success
    : isDanger
    ? colors.danger
    : isWarning
    ? colors.warning
    : colors.primary;

  const bgColor = isSuccess
    ? colors.successBg
    : isDanger
    ? colors.dangerBg
    : isWarning
    ? colors.warningBg
    : colors.secondary;

  return (
    <Animated.View
      style={[
        styles.toastWrapper,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View
        style={[
          styles.toastCard,
          {
            backgroundColor: colors.surface,
            borderColor: accentColor,
            borderRadius: radii.md,
          },
          shadows.card,
        ]}
      >
        <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
          <Ionicons name={iconName} size={22} color={accentColor} />
        </View>

        <View style={styles.textBox}>
          <Text style={[styles.toastTitle, { color: colors.text }]}>{toast.title}</Text>
          <Text style={[styles.toastMessage, { color: colors.textSecondary }]}>{toast.message}</Text>
        </View>

        <TouchableOpacity onPress={onDismiss} style={styles.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="close" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    top: 55,
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderLeftWidth: 5,
    borderWidth: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textBox: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  toastMessage: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
    marginLeft: 8,
  },
});
