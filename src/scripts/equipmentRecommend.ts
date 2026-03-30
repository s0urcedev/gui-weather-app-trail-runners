import type { WeatherData } from "./weather";
import { detectConditions } from "./weatherConditions";
import { EQUIPMENT_CATALOG , type EquipmentItem, type ConditionTag } from "./equipment";

export interface EquipmentRecommendation {
    conditions: string[];
    mustHave: EquipmentItem[];
    niceToHave: EquipmentItem[];
}

function buildRecommendationForConditions(tags: ConditionTag[], reasons: string[]): EquipmentRecommendation {
    if (tags.length === 0) {
        return {
            conditions: ["No significant adverse weather conditions detected."],
            mustHave: [],
            niceToHave: [],
        };
    }
    const seen = new Set<string>();
    const mustHave: EquipmentItem[] = [];
    const niceToHave: EquipmentItem[] = [];

    for (const item of EQUIPMENT_CATALOG) {
        if(seen.has(item.id)) continue;
        if (item.tags.some(tag => tags.includes(tag))) {
            seen.add(item.id);
            if (item.priority === "must-have") {
                mustHave.push(item);
            } else {
                niceToHave.push(item);
            }
        }
    }
    return {
        conditions: reasons,
        mustHave,
        niceToHave,
        };
}

export function recommendEquipmentForWeather(weather: WeatherData | WeatherData[]): EquipmentRecommendation {
    const points = Array.isArray(weather) ? weather : [weather];
    const allTags = new Set<ConditionTag>();
    const allReasons: string[] = [];

    points.forEach((point, i) => {
        const {tags, reasons} = detectConditions(point);
        tags.forEach(tag => allTags.add(tag));
        reasons.forEach(reason => allReasons.push(`Point ${i + 1}: ${reason}`));
    });
    return buildRecommendationForConditions(Array.from(allTags), allReasons);
}