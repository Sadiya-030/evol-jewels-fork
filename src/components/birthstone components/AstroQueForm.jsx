"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useStoneDataStore } from "../../store/birthstone/stoneData";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Keyboard from "../Keyboard";
import Player from "lottie-react";
import animation from "../../../public/circle.json";
import star from "../../../public/star.svg";

const AstroQueForm = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [activeField, setActiveField] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const { setStoneData } = useStoneDataStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      birthdate: null,
      city: "",
      timeOfBirth: "",
    },
  });

  // Handle click outside to close keyboard
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isKeyboardOpen) return;
      const target = event.target;
      if (target.closest('[data-keyboard="true"]')) return;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if (target.closest("[data-slot=popover-content]")) return;
      setIsKeyboardOpen(false);
      setActiveField("");
    };

    const eventOptions = { passive: false, capture: true };
    document.addEventListener("mousedown", handleClickOutside, eventOptions);
    document.addEventListener("touchstart", handleClickOutside, eventOptions);
    document.addEventListener("pointerdown", handleClickOutside, eventOptions);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
        eventOptions,
      );
      document.removeEventListener(
        "touchstart",
        handleClickOutside,
        eventOptions,
      );
      document.removeEventListener(
        "pointerdown",
        handleClickOutside,
        eventOptions,
      );
    };
  }, [isKeyboardOpen]);

  const handleInputFocus = (fieldName) => {
    setActiveField(fieldName);
    if (fieldName !== "birthdate") {
      setIsKeyboardOpen(true);
    }
  };

  const handleKeyPress = (key) => {
    if (activeField === "birthdate") return;

    const currentValue = watch(activeField) || "";

    if (key === "Delete") {
      setValue(activeField, currentValue.slice(0, -1), {
        shouldValidate: true,
      });
    } else {
      setValue(activeField, currentValue + key, { shouldValidate: true });
    }
  };

  const onSubmit = async (data) => {
    if (loading) return;

    try {
      setLoading(true);
      setApiError(null);

      const d = data.birthdate;

      const formattedData = {
        ...data,
        birthdate: d
          ? `${String(d.getDate()).padStart(2, "0")}-${String(
              d.getMonth() + 1,
            ).padStart(2, "0")}-${d.getFullYear()}`
          : null,
      };

      const res = await fetch("/api/birth-stone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.message || "Something went wrong");
      }

      const response = await res.json();
      setStoneData(response);
      router.push("/home/birthstone/your-birthstone");
    } catch (error) {
      console.error("Birthstone API Error:", error);
      setApiError(error.message || "Failed to submit details");
    } finally {
      setLoading(false);
    }
  };

  const selectedDate = watch("birthdate");
  const timeValue = watch("timeOfBirth");

  return (
    <div className="relative w-full min-h-screen flex items-start justify-center bg-black/10">
      <div className="flex flex-col max-w-4xl px-6 pt-[60px] w-full items-center h-full">
        {/* Premium Birthstone Hero */}
        <div className="relative w-full flex justify-center mt-[88px] mb-[110px]">
          {/* Floating Star Top Left */}
          <img
            src={star.src}
            className="absolute z-0 top-10 left-[260px] w-10 h-10 opacity-80"
            alt="star icon"
          />

          {/* Main Circle Animation */}
          <div className="h-[471px] w-[471px] opacity-45 rounded-full">
            <Player
              animationData={animation}
              loop
              autoplay
              renderer="svg"
              className="relative h-full scale-150 w-full"
            />
          </div>

          {/* Floating Star Bottom Right */}
          <img
            src={star.src}
            className="absolute bottom-24 z-0 h-16 w-auto right-[380px] opacity-80"
            alt="star icon"
          />

          {/* Overlay Center Text */}
          <div className="absolute top-0 left-0 z-10 w-full h-full flex items-center justify-center">
            <p className="text-white text-[60px] max-w-[700px] font-ethereal leading-[80px] text-center px-6">
              Let the stars reveal your perfect birthstone
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-14"
        >
          {/* Question 1 - Date & Time Combined */}
          <div className="flex flex-col gap-4">
            <label className="text-white text-center font-[Hind] text-[40px] font-light leading-[76px]">
              When were you born?
            </label>

            <Controller
              control={control}
              name="birthdate"
              rules={{ required: "Birthdate is required" }}
              render={({ field }) => (
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setCalendarOpen(true)}
                      className="h-[108px] px-[45px] w-full rounded-[12px] border border-[rgba(237,217,217,0.26)] bg-white/20 text-white text-4xl outline-none focus:border-white/60 flex items-center justify-between"
                    >
                      <span
                        className={field.value ? "text-white" : "text-white/60"}
                      >
                        {field.value
                          ? `${format(field.value, "dd/MM/yyyy")}${timeValue ? ` at ${timeValue}` : ""}`
                          : "Select birthdate & time"}
                      </span>
                      <CalendarIcon className="h-8 w-8 text-white/60" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 border-2 border-white/30 rounded-2xl overflow-hidden"
                    align="center"
                    sideOffset={8}
                  >
                    <div className="bg-white rounded-2xl">
                      {/* Calendar */}
                      <div className="p-8">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                          }}
                          disabled={(date) => date > new Date()}
                          captionLayout="dropdown"
                          fromYear={1920}
                          toYear={new Date().getFullYear()}
                          className="kiosk-calendar-large"
                        />
                      </div>

                      {/* Time Input Section */}
                      <div className="border-t-2 border-gray-200 bg-gray-50 p-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-gray-700 text-xl font-medium">
                            Time of Birth (Optional)
                          </label>
                          <div className="relative">
                            <input
                              type="time"
                              value={timeValue}
                              onChange={(e) =>
                                setValue("timeOfBirth", e.target.value)
                              }
                              className="w-full h-16 px-5 text-2xl rounded-xl border-2 border-gray-300 bg-white text-gray-800 outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>

                        {/* Done Button */}
                        <button
                          type="button"
                          onClick={() => setCalendarOpen(false)}
                          className="w-full mt-5 h-14 bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold rounded-xl transition-colors"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            />

            {errors.birthdate && (
              <p className="text-red-400 text-lg text-center">
                {errors.birthdate.message}
              </p>
            )}
          </div>

          {/* Question 2 - City */}
          <div className="flex flex-col gap-4">
            <label className="text-white text-center font-[Hind] text-[40px] font-light leading-[76px]">
              Where were you born?
            </label>
            <input
              type="text"
              {...register("city")}
              onFocus={() => handleInputFocus("city")}
              className="h-[108px] px-[45px] rounded-[12px] border border-[rgba(237,217,217,0.26)] bg-white/20 text-white text-4xl outline-none focus:border-white/60"
              placeholder="City, Country (optional)"
            />
          </div>

          {apiError && (
            <p className="text-red-400 text-lg text-center mt-1">{apiError}</p>
          )}

          {/* Continue Button */}
          <div className="w-full flex justify-center mt-8 mb-12">
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="w-full max-w-2xl h-[103px] px-10 py-4 shadow-[0_0_30px_rgba(255,255,255,0.7)] cursor-pointer font-ethereal text-[40px] leading-[72px] rounded-[2000px] bg-white text-[#302B2C] font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Loading..." : "Continue"}
            </button>
          </div>
        </form>

        <Keyboard
          iscloseVisible={false}
          number={true}
          isOpen={isKeyboardOpen}
          onClose={() => setIsKeyboardOpen(false)}
          onKeyPress={handleKeyPress}
        />
      </div>

      {/* Kiosk Calendar Styles - Extra Large & Clear */}
      <style jsx global>{`
        [data-slot="popover-content"] {
          background: white !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
          width: auto !important;
          min-width: 600px !important;
        }

        .kiosk-calendar-large {
          --cell-size: 75px;
          font-size: 1.5rem;
        }

        .kiosk-calendar-large [data-slot="calendar"] {
          background: white !important;
          padding: 1rem;
        }

        /* Month/Year Header */
        .kiosk-calendar-large .rdp-caption_label,
        .kiosk-calendar-large [class*="caption"] {
          font-size: 2rem !important;
          font-weight: 600 !important;
          color: #1f2937 !important;
        }

        /* Navigation Buttons */
        .kiosk-calendar-large button {
          color: #374151 !important;
          min-width: 60px !important;
          min-height: 60px !important;
        }

        .kiosk-calendar-large button:hover {
          background: #f3f4f6 !important;
        }

        /* Navigation Arrows - Increase size */
        .kiosk-calendar-large button svg {
          width: 32px !important;
          height: 32px !important;
        }

        /* Weekday Headers */
        .kiosk-calendar-large .rdp-weekday,
        .kiosk-calendar-large [class*="weekday"] {
          font-size: 1.4rem !important;
          color: #6b7280 !important;
          font-weight: 500 !important;
          padding: 1rem 0 !important;
        }

        /* Day Cells */
        .kiosk-calendar-large .rdp-day,
        .kiosk-calendar-large [class*="day"] button {
          font-size: 1.5rem !important;
          color: #1f2937 !important;
          width: 70px !important;
          height: 70px !important;
        }

        /* Selected Day */
        .kiosk-calendar-large [data-selected-single="true"],
        .kiosk-calendar-large [data-selected="true"] button {
          background: #2563eb !important;
          color: white !important;
          font-weight: 600 !important;
        }

        /* Today */
        .kiosk-calendar-large [data-today="true"] {
          background: #dbeafe !important;
          font-weight: 600 !important;
        }

        /* Disabled Days */
        .kiosk-calendar-large [data-disabled="true"],
        .kiosk-calendar-large .rdp-day_disabled {
          color: #d1d5db !important;
          opacity: 0.5 !important;
        }

        /* Outside Month Days */
        .kiosk-calendar-large [data-outside="true"],
        .kiosk-calendar-large .rdp-day_outside {
          color: #9ca3af !important;
        }

        /* Dropdown Selects */
        .kiosk-calendar-large select {
          background: white !important;
          color: #1f2937 !important;
          border: 2px solid #e5e7eb !important;
          padding: 0.75rem 1.25rem !important;
          border-radius: 0.5rem !important;
          font-size: 1.3rem !important;
          font-weight: 500 !important;
          cursor: pointer !important;
        }

        .kiosk-calendar-large select:hover {
          border-color: #3b82f6 !important;
        }

        .kiosk-calendar-large select option {
          background: white !important;
          color: #1f2937 !important;
          padding: 0.75rem !important;
        }

        /* Week rows */
        .kiosk-calendar-large .rdp-week,
        .kiosk-calendar-large [class*="week"] {
          gap: 0.5rem !important;
        }
      `}</style>
    </div>
  );
};

export default AstroQueForm;
