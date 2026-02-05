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
    <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white border-b border-gray-200">
      <label className="text-xs font-medium text-gray-500 whitespace-nowrap hidden sm:block">
        {t("scenario", lang)}:
      </label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value as Scenario)}
        disabled={disabled}
        className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-xs sm:text-sm bg-white truncate"
      >
        {scenarios.map((scenario) => (
          <option key={scenario.id} value={scenario.id}>
            {scenario.name}
          </option>
        ))}
      </select>
    </div>
  );
}
