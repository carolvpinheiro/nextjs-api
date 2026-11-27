import PencilIcon from "../icons/PencilIcon";

const statuses = {
  completed: {
    label: "Completed",
    message: "🍓 That’s a wrap!",
    colors: "bg-[#DDF1EB] text-[#174C48]",
  },
  overdue: {
    label: "Overdue",
    message: "🐢 Better late than never!",
    colors: "bg-red-100 text-red-800",
  },
  today: {
    label: "Due today",
    message: "⏰ Today’s the day!",
    colors: "bg-[#FEF3C7] text-[#78350F]",
  },
  upcoming: {
    label: "Upcoming",
    message: "🌿 Still time to make it happen!",
    colors: "bg-[#EDE4F3] text-[#573866]",
  },
};

function getMilestoneStatus({ completed_at, due_date }) {
  if (completed_at) return statuses.completed;
  if (!due_date) return null;

  // compare calendar dates in the user's local time zone
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const today = `${now.getFullYear()}-${month}-${day}`;

  if (due_date < today) return statuses.overdue;
  if (due_date === today) return statuses.today;
  return statuses.upcoming;
}

export default function MilestoneCard({ milestone, onEdit }) {
  const status = getMilestoneStatus(milestone);

  return (
    <article className="flex flex-wrap items-start gap-3 rounded-lg border border-[#E9E1E7] bg-white px-4 py-3">
      <div className="min-w-0 flex-1">
        <h2 className="break-words font-semibold">{milestone.title}</h2>

        <p className="mt-1 text-sm text-slate-600">
          {milestone.due_date ? (
            <>
              Due{" "}
              <time dateTime={milestone.due_date}>{milestone.due_date}</time>
            </>
          ) : (
            "No due date"
          )}
        </p>
      </div>

      {status && (
        <div className="ml-auto text-right">
          <span
            className={`inline-block rounded-full px-2.5 py-1 text-sm font-medium ${status.colors}`}
          >
            {status.label}
          </span>
          <p className="mt-1 text-sm text-slate-600">{status.message}</p>
        </div>
      )}
      <button
        type="button"
        onClick={() => onEdit(milestone)}
        aria-label={`Edit ${milestone.title}`}
        title="Edit milestone"
        className="grid size-10 shrink-0 place-items-center rounded-lg text-[#30243A] hover:bg-[#30243A]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#30243A]"
      >
        <PencilIcon className="size-5" />
      </button>
    </article>
  );
}
