import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context";
import { toast } from "react-toastify";
import { EventItem } from "../../types/event";

const MyEvent = () => {
  const { signedIn } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [showAll, setShowAll] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/events?page=1&limit=16"
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : data.results ?? []);
    } catch (err) {
      console.error("Error fetching events:", err);
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getCategory = (event: EventItem): string => {
    const t = (event.title || "").toLowerCase();
    if (t.includes("ux") || t.includes("design") || t.includes("figma"))
      return "design";
    if (t.includes("coding") || t.includes("code") || t.includes("design ops"))
      return "tech";
    return "general";
  };

  const getCategoryStyle = (category:string): string => {
    switch (category) {
      case "design":
        return "bg-pink-100 border-pink-200";
      case "tech":
        return "bg-blue-100 border-blue-200";
      default:
        return "bg-green-100 border-green-200";
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!signedIn) return;
    if (!confirm("Delete this event?")) return;

    try {
      const token = localStorage.getItem("token"); // 从 localStorage 取 token
      const response = await fetch(`http://localhost:3001/api/events/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      // 本地移除（统一为字符串比较，避免 '30' 与 30 不相等）
      setEvents((prev) =>
        prev.filter((ev) => String(ev._id ?? ev.id) !== String(id))
      );

      toast.success("Deleted");
    } catch (e) {
     if (e instanceof Error) {
      toast.error(e.message);
     } else {
      toast.error("Delete failed");
     }
    }
  };

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">
        Our Product Event Series 2026
      </h2>

      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.slice(0, showAll ? events.length : 11).map((event) => {
            const id = event._id ?? event.id;
            return (
              <Link
                key={id}
                to={`/eventDetail/${id}`}
                className="bg-base-200 shadow-sm rounded-xl hover:shadow-lg transition cursor-pointer"
              >
                <div
                  className={`relative card-xs p-4 rounded-lg ${getCategoryStyle(
                    getCategory(event)
                  )}`}
                >
                  {/* 右上角 Delete 圆形按钮 */}
                  {signedIn && (
                    <button
                      type="button"
                      className="btn btn-circle btn-xs absolute top-4 right-4 z-10 border border-red-300 text-red-600 bg-white/80 hover:bg-gray-900 hover:text-white transition"
                      aria-label="Delete"
                      title="Delete"
                      onClick={(e) => {
                        e.preventDefault(); // 阻止外层 <Link> 导航
                        e.stopPropagation();
                        handleDelete(id);
                      }}
                    >
                      ✕
                    </button>
                  )}

                  <h3 className="text-md font-mono text-gray-900 line-clamp-1">
                    <span>Event Serie: </span>
                    {event.title || event.name}
                  </h3>

                  <p className="text-xs font-mono text-gray-500 mt-4">
                    Time:{" "}
                    {event.date
                      ? new Date(event.date).toLocaleString()
                      : "No date provided"}
                  </p>

                  <p className="text-xs font-mono text-gray-500 mt-2 line-clamp-1">
                    Place: {event.location || "Unknown location"}
                  </p>

                  <p className="text-xs font-mono text-gray-500 mt-2 line-clamp-1">
                    Description: {event.description || event.details}
                  </p>

                  <div className="mt-6 flex justify-end">
                    <button className="btn btn-neutral btn-outline">
                      Know more
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <g clipPath="url(#clip0)">
                          {/* 注意是 clipPath */}
                          <path
                            d="M5.87988 4.12L13.7599 12L5.87988 19.88L7.99988 22L17.9999 12L7.99988 2L5.87988 4.12Z"
                            fill="currentColor"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* 展开更多卡片 */}
          {events.length > 11 && !showAll && (
            <div
              className="card bg-gradient-to-r from-pink-200 to-green-200 shadow flex items-center justify-center cursor-pointer hover:bg-base-200 transition"
              onClick={() => setShowAll(true)}
            >
              <span className="text-2xl text-blue-400 font-semibold">
                Want more Events?
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyEvent;
