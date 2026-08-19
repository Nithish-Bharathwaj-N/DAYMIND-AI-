package com.daymind.intelligence;

import com.daymind.model.Category;
import org.springframework.stereotype.Service;

/**
 * EnergyAlignmentService — Intelligence Engine v2
 * Maps hour slots and task categories to cognitive focus levels:
 * DEEP_FOCUS, FOCUS, NORMAL, LOW_ENERGY.
 */
@Service
public class EnergyAlignmentService {

    public enum EnergyLevel {
        DEEP_FOCUS(100),
        FOCUS(80),
        NORMAL(60),
        LOW_ENERGY(40);

        private final int score;
        EnergyLevel(int score) { this.score = score; }
        public int getScore() { return score; }
    }

    public EnergyLevel getSlotEnergy(int hourSlot) {
        if ((hourSlot >= 8 && hourSlot <= 11) || (hourSlot >= 14 && hourSlot <= 16)) {
            return EnergyLevel.DEEP_FOCUS;
        } else if (hourSlot == 11 || hourSlot == 12 || hourSlot == 13) {
            return EnergyLevel.FOCUS;
        } else if (hourSlot >= 16 && hourSlot <= 18) {
            return EnergyLevel.NORMAL;
        }
        return EnergyLevel.LOW_ENERGY;
    }

    public EnergyLevel getRequiredEnergy(Category category) {
        if (category == null) return EnergyLevel.NORMAL;
        switch (category) {
            case ACADEMIC:
            case LEARNING:
            case WORK:
            case URGENT:
                return EnergyLevel.DEEP_FOCUS;
            case HEALTH:
            case PERSONAL:
                return EnergyLevel.FOCUS;
            default:
                return EnergyLevel.LOW_ENERGY;
        }
    }

    public int calculateEnergyCompatibility(Category category, int hourSlot) {
        EnergyLevel required = getRequiredEnergy(category);
        EnergyLevel available = getSlotEnergy(hourSlot);

        if (required == EnergyLevel.DEEP_FOCUS && available == EnergyLevel.DEEP_FOCUS) {
            return 100; // Perfect match
        } else if (required == EnergyLevel.DEEP_FOCUS && available == EnergyLevel.FOCUS) {
            return 80;
        } else if (required == EnergyLevel.DEEP_FOCUS && available == EnergyLevel.LOW_ENERGY) {
            return 40; // Penalty
        }
        return 75;
    }
}
