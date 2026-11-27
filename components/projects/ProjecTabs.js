"use client";

import { useState } from "react";
import ProjectTasks from "../tasks/ProjectTasks";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "tasks", label: "Tasks" },
  { id: "milestones", label: "Milestones" },
  { id: "attachments", label: "Attachments" },
  { id: "comments", label: "Comments" },
];

export default function ProjectTabs({ projectId, description }) {
  // state responsble to manage the tabs displaying the correct page
  // set the current tab when clicked by take the tabs id
  const [activeTab, setActiveTab] = useState("overview");

  // veriy the activit tab and store its lable
  const activeLabel = tabs.find((tab) => tab.id === activeTab)?.label;

  return (
    <div className="space-y-4">
      <div
        role="group"
        aria-label="Project sections"
        className="flex gap-4 overflow-x-auto border-b border-[#E9E1E7]"
      >
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            aria-pressed={activeTab === id}
            onClick={() => setActiveTab(id)}
            className={`shrink-0 whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-[#21665E] ${
              activeTab === id
                ? "border-[#21665E] text-[#21665E]"
                : "border-transparent text-slate-600 hover:text-[#21665E]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <p className="whitespace-pre-wrap break-words text-slate-600">
          {/* use a fallback when the description is missing or blank */}
          {description?.trim() || "No description provided."}
        </p>
      )}

      {/* load the task list when the user opens the Tasks section */}
      {activeTab === "tasks" && <ProjectTasks projectId={projectId} />}

      {activeTab !== "overview" && activeTab !== "tasks" && (
        <p className="text-sm text-slate-600">
          {activeLabel} will be available here once this section is connected.
        </p>
      )}
    </div>
  );
}
