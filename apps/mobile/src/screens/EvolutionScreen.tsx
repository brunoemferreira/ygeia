import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { PatientProfile } from '../types/patientApp';

interface EvolutionScreenProps {
  profile: PatientProfile;
}

export const EvolutionScreen: React.FC<EvolutionScreenProps> = ({ profile }) => {
  const history = [
    { date: '22/11/2026 (Hoje)', weight: 78.5, fat: 13.8, note: 'Ganho de massa magra e redução de 0.4% de gordura' },
    { date: '08/11/2026', weight: 78.1, fat: 14.2, note: 'Adesão ao protocolo peri-treino' },
    { date: '25/10/2026', weight: 77.4, fat: 14.6, note: 'Início da fase de hipertrofia' },
    { date: '10/10/2026', weight: 76.8, fat: 15.3, note: 'Consulta inicial de avaliação' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Resumo de Metas */}
      <View style={styles.card}>
        <Text style={styles.tag}>Composição Corporal & Metas</Text>
        <Text style={styles.title}>Evolução Antropométrica</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Peso Atual</Text>
            <Text style={styles.statValue}>{profile.weight} kg</Text>
            <Text style={styles.statChange}>+1.7 kg desde o início</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Meta de Peso</Text>
            <Text style={styles.statValue}>{profile.targetWeight} kg</Text>
            <Text style={styles.statChange}>Faltam 3.5 kg</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>% de Gordura</Text>
            <Text style={styles.statValue}>{profile.bodyFatPercentage}%</Text>
            <Text style={[styles.statChange, { color: Colors.success }]}>-1.5% gordura</Text>
          </View>
        </View>
      </View>

      {/* Histórico de Pesagens */}
      <Text style={styles.sectionHeader}>Histórico de Acompanhamento</Text>

      {history.map((item, idx) => (
        <View key={idx} style={styles.historyCard}>
          <View style={styles.historyTop}>
            <Text style={styles.historyDate}>📅 {item.date}</Text>
            <View style={styles.historyBadges}>
              <Text style={styles.weightBadge}>{item.weight} kg</Text>
              <Text style={styles.fatBadge}>{item.fat}% BF</Text>
            </View>
          </View>
          <Text style={styles.historyNote}>{item.note}</Text>
        </View>
      ))}

      {/* Dicas de Motivação */}
      <View style={styles.motivationCard}>
        <Text style={styles.motivationTitle}>🏆 Dica da Nutricionista</Text>
        <Text style={styles.motivationText}>
          "A recomposição corporal é um processo sustentável. Mais importante do que o número estático na balança é a preservação da massa livre de gordura e sua vitalidade diária."
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
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  tag: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    marginVertical: 4,
  },
  statChange: {
    fontSize: 9,
    color: Colors.primary,
    fontWeight: '700',
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
  },
  historyCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  historyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  historyDate: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  historyBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  weightBadge: {
    backgroundColor: Colors.primaryLight,
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  fatBadge: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  historyNote: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  motivationCard: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 14,
    padding: 14,
    marginTop: 6,
  },
  motivationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#b45309',
    marginBottom: 4,
  },
  motivationText: {
    fontSize: 12,
    color: '#92400e',
    fontStyle: 'italic',
    lineHeight: 17,
  },
});
