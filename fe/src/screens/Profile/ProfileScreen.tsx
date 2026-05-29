import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Bell, ChevronRight, LogOut, Mail, Phone, Settings, Shield, User } from 'lucide-react-native';
import { Header } from '@/components/common/Header';
import { Screen } from '@/components/common/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { mockUser } from '@/data/mockData';
import { colors, radius } from '@/theme/colors';

export function ProfileScreen() {
  const { user, logout } = useAuth();
  const profile = user ?? mockUser;

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.hero}>
        <Header title="" />
        <View style={styles.avatar}>
          <User size={46} color={colors.white} />
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>{profile.email}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Information</Text>
          <InfoRow icon={<Mail size={20} color="#94a3b8" />} label="Email" value={profile.email} />
          <InfoRow icon={<Phone size={20} color="#94a3b8" />} label="Phone" value="+1 (555) 123-4567" last />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Settings</Text>
          <MenuRow icon={<Bell size={20} color={colors.slate} />} label="Notifications" />
          <MenuRow icon={<Shield size={20} color={colors.slate} />} label="Security" />
          <MenuRow icon={<Settings size={20} color={colors.slate} />} label="Preferences" last />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.75}>
          <LogOut size={20} color={colors.dangerDark} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Smart Fire Alert v1.0.0</Text>
      </View>
    </Screen>
  );
}

function InfoRow({ icon, label, value, last }: { icon: React.ReactNode; label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, last && styles.rowLast]}>
      {icon}
      <View style={styles.infoCopy}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function MenuRow({ icon, label, last }: { icon: React.ReactNode; label: string; last?: boolean }) {
  return (
    <TouchableOpacity style={[styles.menuRow, last && styles.rowLast]} activeOpacity={0.75}>
      <View style={styles.menuLeft}>
        {icon}
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <ChevronRight size={20} color="#94a3b8" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 0,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    backgroundColor: colors.slateDark,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingBottom: 30,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: radius.pill,
    height: 84,
    justifyContent: 'center',
    marginBottom: 13,
    width: 84,
  },
  name: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '900',
  },
  email: {
    color: '#cbd5e1',
    fontSize: 14,
    marginTop: 4,
  },
  body: {
    padding: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 5,
  },
  infoRow: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  infoCopy: {
    flex: 1,
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: 12,
  },
  infoValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 3,
  },
  menuRow: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  menuLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 15,
  },
  logoutText: {
    color: colors.dangerDark,
    fontSize: 15,
    fontWeight: '900',
  },
  version: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 24,
    textAlign: 'center',
  },
});

