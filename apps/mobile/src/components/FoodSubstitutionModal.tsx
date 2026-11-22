import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors } from '../theme/colors';
import { MealFood, FoodSubstitution } from '../types/patientApp';

interface FoodSubstitutionModalProps {
  visible: boolean;
  food: MealFood | null;
  onClose: () => void;
  onSelectSubstitution: (originalFoodId: string, substitution: FoodSubstitution) => void;
}

export const FoodSubstitutionModal: React.FC<FoodSubstitutionModalProps> = ({
  visible,
  food,
  onClose,
  onSelectSubstitution,
}) => {
  if (!food) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.badge}>Lista de Substituição Nutricional</Text>
              <Text style={styles.title}>Substituir {food.name}</Text>
              <Text style={styles.subtitle}>
                Porção prescrita: {food.quantity} {food.unit} ({food.calories} kcal)
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Comparativo do Original */}
          <View style={styles.originalCard}>
            <Text style={styles.originalLabel}>Alimento Atual:</Text>
            <Text style={styles.originalName}>{food.name}</Text>
            <Text style={styles.originalMacros}>
              {food.calories} kcal • P: {food.protein}g • C: {food.carbs}g • G: {food.fats}g
            </Text>
          </View>

          <Text style={styles.listTitle}>
            Opções Equivalentes Recomendadas pelo Nutricionista:
          </Text>

          <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
            {food.substitutions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Não há substitutos cadastrados para este item. Fale com seu nutricionista.
                </Text>
              </View>
            ) : (
              food.substitutions.map((sub) => (
                <TouchableOpacity
                  key={sub.id}
                  style={styles.subItem}
                  activeOpacity={0.7}
                  onPress={() => onSelectSubstitution(food.id, sub)}
                >
                  <View style={styles.subLeft}>
                    <Text style={styles.subName}>{sub.name}</Text>
                    <Text style={styles.subQuantity}>
                      Quantidade equivalente: <Text style={styles.qtyHighlight}>{sub.quantity} {sub.unit}</Text>
                    </Text>
                    <Text style={styles.subMacros}>
                      {sub.calories} kcal • P: {sub.protein}g • C: {sub.carbs}g • G: {sub.fats}g
                    </Text>
                  </View>

                  <View style={styles.subAction}>
                    <Text style={styles.subActionText}>Trocar</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Manter Alimento Original</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  badge: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  originalCard: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  originalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  originalName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
  },
  originalMacros: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  listTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  scrollList: {
    maxHeight: 280,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  subLeft: {
    flex: 1,
    marginRight: 10,
  },
  subName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  subQuantity: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  qtyHighlight: {
    fontWeight: '700',
    color: Colors.primary,
  },
  subMacros: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 3,
  },
  subAction: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  subActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  cancelButton: {
    marginTop: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
});
