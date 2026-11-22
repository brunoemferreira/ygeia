import { AnamneseData } from '../components/patients/AnamneseEditor';
import { RecallItem } from '../components/patients/tabs/PatientRecallsTab';
import { ProntuarioItem } from '../components/patients/tabs/PatientMedicalRecordsTab';
import { FoodRestriction } from '../components/patients/tabs/PatientRestrictionsTab';

const API_BASE = ((import.meta as any).env?.VITE_API_URL || 'http://localhost:4333') + '/api/v1';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('ygeia_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const ClinicalApiService = {
  // ==========================================
  // 1. ANAMNESES
  // ==========================================
  async getAnamneses(patientId: string): Promise<AnamneseData[]> {
    const storageKey = `ygeia_anamneses_${patientId}`;
    try {
      const res = await fetch(`${API_BASE}/patients/${patientId}/anamneses`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem(storageKey, JSON.stringify(data));
          return data;
        }
      }
    } catch (err) {
      console.warn('API indisponível, usando fallback de storage:', err);
    }
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  },

  async saveAnamnese(patientId: string, anamnese: AnamneseData): Promise<AnamneseData> {
    const storageKey = `ygeia_anamneses_${patientId}`;
    try {
      const res = await fetch(`${API_BASE}/patients/${patientId}/anamneses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: anamnese.title,
          templateType: anamnese.templateType,
          recordDate: anamnese.date,
          contentHtml: anamnese.contentHtml,
          sections: anamnese.sections,
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        return saved;
      }
    } catch (err) {
      console.warn('Falha na API de anamnese, persistindo localmente:', err);
    }
    // Fallback Local
    const current = await this.getAnamneses(patientId);
    const existingIdx = current.findIndex((a) => a.id === anamnese.id);
    let updated: AnamneseData[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = anamnese;
    } else {
      updated = [anamnese, ...current];
    }
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return anamnese;
  },

  async deleteAnamnese(patientId: string, id: string): Promise<void> {
    const storageKey = `ygeia_anamneses_${patientId}`;
    try {
      await fetch(`${API_BASE}/patients/${patientId}/anamneses/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch {}
    const current = await this.getAnamneses(patientId);
    const filtered = current.filter((a) => a.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(filtered));
  },

  // ==========================================
  // 2. RECORDATÓRIOS ALIMENTARES
  // ==========================================
  async getRecalls(patientId: string): Promise<RecallItem[]> {
    const storageKey = `ygeia_recalls_${patientId}`;
    try {
      const res = await fetch(`${API_BASE}/patients/${patientId}/recalls`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem(storageKey, JSON.stringify(data));
          return data;
        }
      }
    } catch (err) {
      console.warn('API indisponível para recalls, usando cache:', err);
    }
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  },

  async saveRecall(patientId: string, item: RecallItem): Promise<RecallItem> {
    const storageKey = `ygeia_recalls_${patientId}`;
    try {
      const res = await fetch(`${API_BASE}/patients/${patientId}/recalls`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: item.title,
          templateType: item.templateType,
          recordDate: item.date,
          notes: item.notes,
        }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API de recall indisponível, salvando local:', err);
    }
    const current = await this.getRecalls(patientId);
    const idx = current.findIndex((r) => r.id === item.id);
    let updated: RecallItem[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = item;
    } else {
      updated = [item, ...current];
    }
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return item;
  },

  async deleteRecall(patientId: string, id: string): Promise<void> {
    const storageKey = `ygeia_recalls_${patientId}`;
    try {
      await fetch(`${API_BASE}/patients/${patientId}/recalls/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch {}
    const current = await this.getRecalls(patientId);
    const filtered = current.filter((r) => r.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(filtered));
  },

  // ==========================================
  // 3. PRONTUÁRIO & EVOLUÇÃO
  // ==========================================
  async getMedicalRecords(patientId: string): Promise<ProntuarioItem[]> {
    const storageKey = `ygeia_prontuario_${patientId}`;
    try {
      const res = await fetch(`${API_BASE}/patients/${patientId}/medical-records`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem(storageKey, JSON.stringify(data));
          return data;
        }
      }
    } catch (err) {
      console.warn('API indisponível para prontuário, usando cache:', err);
    }
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  },

  async saveMedicalRecord(patientId: string, item: ProntuarioItem): Promise<ProntuarioItem> {
    const storageKey = `ygeia_prontuario_${patientId}`;
    try {
      const res = await fetch(`${API_BASE}/patients/${patientId}/medical-records`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: item.title,
          templateType: item.templateType,
          recordDate: item.date,
          notes: item.notes,
        }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API de prontuário indisponível, salvando local:', err);
    }
    const current = await this.getMedicalRecords(patientId);
    const idx = current.findIndex((p) => p.id === item.id);
    let updated: ProntuarioItem[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = item;
    } else {
      updated = [item, ...current];
    }
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return item;
  },

  async deleteMedicalRecord(patientId: string, id: string): Promise<void> {
    const storageKey = `ygeia_prontuario_${patientId}`;
    try {
      await fetch(`${API_BASE}/patients/${patientId}/medical-records/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch {}
    const current = await this.getMedicalRecords(patientId);
    const filtered = current.filter((p) => p.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(filtered));
  },

  // ==========================================
  // 4. RESTRIÇÕES ALIMENTARES
  // ==========================================
  async getRestrictions(patientId: string): Promise<FoodRestriction[]> {
    const storageKey = `ygeia_restrictions_${patientId}`;
    try {
      const res = await fetch(`${API_BASE}/patients/${patientId}/restrictions`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem(storageKey, JSON.stringify(data));
          return data;
        }
      }
    } catch (err) {
      console.warn('API indisponível para restrições, usando cache:', err);
    }
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  },

  async saveRestriction(patientId: string, item: FoodRestriction): Promise<FoodRestriction> {
    const storageKey = `ygeia_restrictions_${patientId}`;
    try {
      const res = await fetch(`${API_BASE}/patients/${patientId}/restrictions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          foodOrSubstance: item.foodOrSubstance,
          reason: item.reason,
          status: item.status,
          origin: item.origin,
          observation: item.observation,
        }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API de restrições indisponível, salvando local:', err);
    }
    const current = await this.getRestrictions(patientId);
    const idx = current.findIndex((r) => r.id === item.id);
    let updated: FoodRestriction[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = item;
    } else {
      updated = [item, ...current];
    }
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return item;
  },

  async toggleRestrictionStatus(patientId: string, id: string): Promise<void> {
    const storageKey = `ygeia_restrictions_${patientId}`;
    try {
      await fetch(`${API_BASE}/patients/${patientId}/restrictions/${id}/toggle`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
    } catch {}
    const current = await this.getRestrictions(patientId);
    const updated = current.map((r) =>
      r.id === id ? { ...r, status: (r.status === 'Ativa' ? 'Inativa' : 'Ativa') as any } : r
    );
    localStorage.setItem(storageKey, JSON.stringify(updated));
  },

  async deleteRestriction(patientId: string, id: string): Promise<void> {
    const storageKey = `ygeia_restrictions_${patientId}`;
    try {
      await fetch(`${API_BASE}/patients/${patientId}/restrictions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch {}
    const current = await this.getRestrictions(patientId);
    const filtered = current.filter((r) => r.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(filtered));
  },
};
