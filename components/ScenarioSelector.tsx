"use client";

import { scenarios, Scenario } from "@/lib/prompts";
import { Language, t } from "@/lib/translations";

interface ScenarioSelectorProps {
  selected: Scenario;
  onChange: (scenario: Scenario) => void;
  disabled?: boolean;
  lang: Language;
}

export default function ScenarioSelector({
  selected,
  onChange,
  disabled,
  lang,
}: ScenarioSelectorProps) {
  return (
    <div className="p-4 bg-white border-b border-gray-200">
      <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
        {t("scenario", lang)}
      </label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value as Scenario)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm bg-white"
      >
        {scenarios.map((scenario) => (
          <option key={scenario.id} value={scenario.id}>
            {scenario.name} - {scenario.description}
          </option>
        ))}
      </select>
    </div>
  );
}
