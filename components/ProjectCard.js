import PencilIcon from "./icons/PencilIcon";
import TrashIcon from "./icons/TrashIcon";
import Link from "next/link";

// recieve the current project and the onEdit method to set it
export default function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <article className="h-full rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h2 className="min-w-0 break-words text-lg font-semibold">
          <Link
            href={`/projects/${encodeURIComponent(project.id)}`}
            className="hover:underline"
          >
            {project.name}
          </Link>
        </h2>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onEdit(project)}
            aria-label={`Edit ${project.name}`}
            title="Edit project"
            className="grid size-10 shrink-0 place-items-center rounded-lg text-[#30243A] hover:bg-[#30243A]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#30243A]"
          >
            {/* import the icon as a component */}
            <PencilIcon className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(project)}
            aria-label={`Delete ${project.name}`}
            title="Delete project"
            className="grid size-10 place-items-center rounded-lg text-[#30243A] hover:bg-[#30243A]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#30243A]"
          >
            <TrashIcon className="size-5" />
          </button>
        </div>
      </div>
      <p className="mt-2 break-words text-sm text-slate-600">
        {/* show project description or display a message */}
        {project.description?.trim() || "No description provided."}
      </p>
    </article>
  );
}
