import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Colors } from '../theme/colors';
import { PatientProfile } from '../types/patientApp';

interface NutritionistScreenProps {
  profile: PatientProfile;
}

export const NutritionistScreen: React.FC<NutritionistScreenProps> = ({ profile }) => {
  const nut = profile.nutritionist;

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá, Dra. Gabriela! Sou o paciente ${profile.name} do app Ygeía e gostaria de tirar uma dúvida sobre meu plano alimentar.`
    );
    Linking.openURL(`https://wa.me/5511987654321?text=${text}`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Card da Profissional */}
      <View style={styles.profileCard}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarInitials}>GV</Text>
        </View>

        <Text style={styles.name}>{nut.name}</Text>
        <Text style={styles.crn}>{nut.crn}</Text>
        <Text style={styles.clinic}>{nut.clinic}</Text>

        <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp} activeOpacity={0.7}>
          <Text style={styles.whatsappIcon}>💬</Text>
          <Text style={styles.whatsappText}>Falar pelo WhatsApp</Text>
        </TouchableOpacity>
      </View>

      {/* Informações da Clínica */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>🏥 Unidade de Atendimento</Text>
        <Text style={styles.infoLine}>📍 Av. Paulista, 1000 - Bela Vista, São Paulo - SP</Text>
        <Text style={styles.infoLine}>⏰ Seg a Sex: 08:00 às 19:00 | Sáb: 08:00 às 13:00</Text>
        <Text style={styles.infoLine}>📞 Telefone: (11) 3214-5500</Text>
      </View>

      {/* Privacidade & LGPD */}
      <View style={styles.lgpdCard}>
        <Text style={styles.lgpdTitle}>🔒 Seus Dados de Saúde Protegidos</Text>
        <Text style={styles.lgpdText}>
          Este aplicativo segue integralmente a LGPD (Lei 13.709/2018) e as resoluções éticas do CFN. Seus registros antropométricos e planos dietéticos são confidenciais e criptografados.
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  profileCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight,
    borderWidth: 2,
    borderColor: Colors.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarInitials: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  crn: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 2,
  },
  clinic: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
    marginBottom: 18,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
  },
  whatsappIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  whatsappText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
  },
  infoLine: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 6,
    lineHeight: 18,
  },
  lgpdCard: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    borderRadius: 14,
    padding: 14,
  },
  lgpdTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  lgpdText: {
    fontSize: 11,
    color: '#065f46',
    lineHeight: 16,
  },
});
