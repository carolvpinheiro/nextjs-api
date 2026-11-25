import Link from "next/link";
import PencilIcon from "./icons/PencilIcon";
import TrashIcon from "./icons/TrashIcon";

const taskStatuses = {
  todo: { label: "To do", colors: "bg-[#EDE4F3] text-[#573866]" },
  in_progress: {
    label: "In progress",
    colors: "bg-[#FEF3C7] text-[#78350F]",
  },
  done: { label: "Done", colors: "bg-[#DDF1EB] text-[#174C48]" },
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const status = taskStatuses[task.status];

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[#E9E1E7] bg-white px-4 py-3">
      <Link
        href={`/tasks/${encodeURIComponent(task.id)}`}
        className="font-medium text-[#21665E] hover:underline"
      >
        {task.name}
      </Link>

      <div className="ml-auto flex items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-sm font-medium ${
            status?.colors ?? "bg-slate-100 text-slate-700"
          }`}
        >
          {status?.label ?? task.status}
        </span>

        <button
          type="button"
          onClick={() => onEdit(task)}
          aria-label={`Edit ${task.name}`}
          title="Edit task"
          className="grid size-10 shrink-0 place-items-center rounded-lg text-[#30243A] hover:bg-[#30243A]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#30243A]"
        >
          <PencilIcon className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          aria-label={`Delete ${task.name}`}
          title="Delete task"
          className="grid size-10 shrink-0 place-items-center rounded-lg text-[#30243A] hover:bg-[#30243A]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#30243A]"
        >
          <TrashIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}
