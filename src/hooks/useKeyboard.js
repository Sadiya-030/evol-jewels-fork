"use client";
import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook to manage keyboard visibility
 * - Shows keyboard when input is focused
 * - Hides keyboard when clicking outside input/keyboard area
 */
export function useKeyboard() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [activeField, setActiveField] = useState("");
  const keyboardRef = useRef(null);
  const inputRefs = useRef({});

  // Register an input field
  const registerInput = useCallback((fieldName, ref) => {
    inputRefs.current[fieldName] = ref;
  }, []);

  // Handle input focus - show keyboard
  const handleInputFocus = useCallback((fieldName) => {
    setActiveField(fieldName);
    setIsKeyboardOpen(true);
  }, []);

  // Close keyboard
  const closeKeyboard = useCallback(() => {
    setIsKeyboardOpen(false);
    setActiveField("");
  }, []);

  // Handle click outside to close keyboard
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isKeyboardOpen) return;

      const target = event.target;

      // Check if click is on keyboard
      const keyboardElement = document.querySelector('[data-keyboard="true"]');
      if (keyboardElement && keyboardElement.contains(target)) {
        return; // Don't close if clicking on keyboard
      }

      // Check if click is on any registered input
      const isInputClick = Object.values(inputRefs.current).some(
        (ref) => ref && ref.contains && ref.contains(target)
      );

      if (isInputClick) {
        return; // Don't close if clicking on an input
      }

      // Check if click target is an input element
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return; // Don't close if clicking on any input
      }

      // Close keyboard for any other click
      closeKeyboard();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isKeyboardOpen, closeKeyboard]);

  return {
    isKeyboardOpen,
    setIsKeyboardOpen,
    activeField,
    setActiveField,
    handleInputFocus,
    closeKeyboard,
    registerInput,
    keyboardRef,
  };
}

export default useKeyboard;
