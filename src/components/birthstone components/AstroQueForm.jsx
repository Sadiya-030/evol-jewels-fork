"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // import default styles
import Keyboard from "../Keyboard";
import { useRouter } from "next/navigation";
import { useStoneDataStore } from "../../store/birthstone/stoneData";

const AstroQueForm = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [activeField, setActiveField] = useState("");
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
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      // Don't close if clicking on date picker
      if (target.closest('.react-datepicker')) return;
      setIsKeyboardOpen(false);
      setActiveField("");
    };

    // Add event listeners with proper options for production touch devices
    const eventOptions = { passive: false, capture: true };

    document.addEventListener("mousedown", handleClickOutside, eventOptions);
    document.addEventListener("touchstart", handleClickOutside, eventOptions);
    document.addEventListener("pointerdown", handleClickOutside, eventOptions);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, eventOptions);
      document.removeEventListener("touchstart", handleClickOutside, eventOptions);
      document.removeEventListener("pointerdown", handleClickOutside, eventOptions);
    };
  }, [isKeyboardOpen]);

  const handleInputFocus = (fieldName) => {
    setActiveField(fieldName);
    if (fieldName !== "birthdate") {
      setIsKeyboardOpen(true);
    }
  };

  const handleKeyPress = (key) => {
    if (activeField === "birthdate") return; // 🚫 block typing

    const currentValue = watch(activeField) || "";

    if (key === "Delete") {
      setValue(activeField, currentValue.slice(0, -1), {
        shouldValidate: true,
      });
    } else {
      setValue(activeField, currentValue + key, {
        shouldValidate: true,
      });
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
              d.getMonth() + 1
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
      // ✅ redirect on success
      router.push("/home/birthstone/your-birthstone");
    } catch (error) {
      console.error("Birthstone API Error:", error);
      setApiError(error.message || "Failed to submit details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-start justify-center bg-black/10">
      <div className="flex flex-col max-w-4xl px-6 pt-[220px] w-full items-center h-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-14"
        >
          {/* Field 1 - Date Picker */}
          <div className="flex flex-col gap-4">
            <label className="text-white text-center font-[Hind] text-[40px] font-light leading-[76px]">
              What’s your birthdate?
            </label>

            <Controller
              control={control}
              name="birthdate"
              rules={{ required: "Birthdate is required" }}
              render={({ field }) => (
                <DatePicker
                  placeholderText="Select your birthdate"
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  onFocus={() => handleInputFocus("birthdate")}
                  className="h-[108px] px-[45px] w-full rounded-[12px] border border-[rgba(237,217,217,0.26)] bg-white/20 text-white text-4xl outline-none focus:border-white/60"
                  dateFormat="dd/MM/yyyy"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  maxDate={new Date()}
                />
              )}
            />

            {errors.birthdate && (
              <p className="text-red-400 text-lg text-center">
                {errors.birthdate.message}
              </p>
            )}
          </div>

          {/* Field 2 */}
          <div className="flex flex-col gap-4 ">
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

          {/* Field 3 */}
          <div className="flex flex-col gap-4 relative">
            <label className="text-white text-center font-[Hind] text-[40px] font-light leading-[76px]">
              Do you know your time of birth?
            </label>
            <input
              type="text"
              {...register("timeOfBirth")}
              onFocus={() => handleInputFocus("timeOfBirth")}
              className="h-[108px] pl-[45px] pr-[100px] rounded-[12px] border border-[rgba(237,217,217,0.26)] bg-white/20 text-white text-4xl outline-none focus:border-white/60"
              placeholder="HH:MM (optional)"
            />
            <svg
              className="absolute top-[120px] right-8"
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
            >
              <path
                d="M24 0C19.2533 0 14.6131 1.40758 10.6663 4.04473C6.71954 6.68188 3.6434 10.4302 1.8269 14.8156C0.0103988 19.201 -0.464881 24.0266 0.461164 28.6822C1.38721 33.3377 3.67299 37.6141 7.02945 40.9706C10.3859 44.327 14.6623 46.6128 19.3178 47.5388C23.9734 48.4649 28.799 47.9896 33.1844 46.1731C37.5698 44.3566 41.3181 41.2805 43.9553 37.3337C46.5924 33.3869 48 28.7467 48 24C47.9933 17.6369 45.4626 11.5363 40.9631 7.03686C36.4637 2.53744 30.3631 0.00671958 24 0ZM36.9231 25.8461H24C23.5104 25.8461 23.0408 25.6516 22.6946 25.3054C22.3484 24.9592 22.1539 24.4896 22.1539 24V11.0769C22.1539 10.5873 22.3484 10.1177 22.6946 9.77149C23.0408 9.42527 23.5104 9.23077 24 9.23077C24.4896 9.23077 24.9592 9.42527 25.3054 9.77149C25.6517 10.1177 25.8462 10.5873 25.8462 11.0769V22.1538H36.9231C37.4127 22.1538 37.8823 22.3483 38.2285 22.6946C38.5747 23.0408 38.7692 23.5104 38.7692 24C38.7692 24.4896 38.5747 24.9592 38.2285 25.3054C37.8823 25.6516 37.4127 25.8461 36.9231 25.8461Z"
                fill="white"
              />
            </svg>
          </div>
          {!apiError && (
            <p className="text-red-400 text-lg text-center mt-1">{apiError}</p>
          )}
        </form>

        <Keyboard
          iscloseVisible={false}
          number={true}
          isOpen={isKeyboardOpen}
          onClose={() => setIsKeyboardOpen(false)}
          onKeyPress={handleKeyPress}
          handleContinue={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
};

export default AstroQueForm;
