import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { PatientProfile } from '../types/patientApp';

interface TopBarProps {
  profile: PatientProfile;
  onToggleMode: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ profile, onToggleMode }) => {
  const isSports = profile.mode === 'esportivo';

  return (
    <View style={styles.container}>
      <View style={styles.leftCol}>
        <View style={styles.avatarContainer}>
          {profile.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitials}>BR</Text>
            </View>
          )}
          <View style={styles.statusDot} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Olá, {profile.name.split(' ')[0]} 👋</Text>
          <Text style={styles.objective} numberOfLines={1}>
            {profile.objective}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.badgeButton, isSports ? styles.sportsBadge : styles.clinicalBadge]}
        onPress={onToggleMode}
        activeOpacity={0.7}
      >
        <Text style={[styles.badgeText, isSports ? styles.sportsText : styles.clinicalText]}>
          {isSports ? '⚡ Alta Performance' : '🍏 Reeducação'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.border,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  objective: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textMuted,
    marginTop: 2,
  },
  badgeButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  sportsBadge: {
    backgroundColor: Colors.workoutBg,
    borderColor: '#ddd6fe',
  },
  clinicalBadge: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primaryBorder,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sportsText: {
    color: '#6d28d9',
  },
  clinicalText: {
    color: Colors.primary,
  },
});
