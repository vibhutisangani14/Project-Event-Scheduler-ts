import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

import { createEvent } from "../data/events";
import { useEvents } from "../context";
import { sleep, validateCreateEventForm } from "../utils";
import { NewEventInput } from "../types/event";

const CreateEvent = () => {
  const { setEvents } = useEvents();
  const navigate = useNavigate();

  // form state
  const [form, setForm] = useState<NewEventInput>({
    title: "",
    description: "",
    date: "",
    location: "",
    latitude: "8.404746955649602",
    longitude: "49.01438194665317",
  });

  // new: validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  // new: loading spinner state
  const [isPending, setIsPending] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (date: Date | null) => {
    setForm((prev) => ({
      ...prev,
      date: date ? date.toISOString() : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateCreateEventForm(form);
    if (Object.keys(validationErrors).length !== 0) {
      toast.error("Validation failed");
      return;
    }

    setIsPending(true);

    try {
      await sleep(1000);
      const newEvent = await createEvent(form);

      // reset form
      setForm({
        title: "",
        description: "",
        date: "",
        location: "",
        latitude: "8.404746955649602",
        longitude: "49.01438194665317",
      });

      setFormErrors({});

      toast.success("There's a new event in your pond!");
      navigate("/events", { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };


  return (
    <form
    onSubmit={handleSubmit}
      className="my-5 md:w-1/2 mx-auto flex flex-col gap-3 items-center"
    >
      <div className="flex flex-col h-full w-full items-center mt-[60px] gap-[1rem]">
        <div className="text-black font-semibold text-2xl mb-2">
          Create New Event
        </div>

        {/* Title */}
        <div className="flex flex-col items-left justify-center">
          <input
            className="input border-black text-black w-[25rem]"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
          />
          {formErrors.title && (
            <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col items-left justify-center">
          <input
            className="input border-black text-black w-[25rem]"
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
          />

          {formErrors.description && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors.description}
            </p>
          )}
        </div>

      {/* Date */}
        <div className="flex flex-col items-left justify-center">
          <div className="relative w-[25rem]">
            <DatePicker
              className="input border-black text-black w-[25rem] pr-10"
              selected={form.date ? new Date(form.date) : null}
              onChange={handleDateChange}
              name="date"
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm"
              placeholderText="Select date and time"
              autoComplete="off"
            />
            <svg
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          {formErrors.date && (
            <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>
          )}
        </div>

        <div className="flex flex-col items-left justify-center">
          <input
            className="input border-black text-black w-[25rem]"
            type="text"
            name="location"
             value={form.location}
            onChange={handleChange}
            placeholder="Location"
          />
          {formErrors.location && (
            <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>
          )}
        </div>
        
        <button type="submit" className="btn btn-neutral" disabled={isPending}>
          {isPending ? (
            <>
              Adding event... <span className="loading loading-spinner"></span>
            </>
          ) : (
            "Add Event"
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateEvent;
