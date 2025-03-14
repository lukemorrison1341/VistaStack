import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box } from "@mui/material";

export default function ColorSplashEffect({ trigger }) {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShowSplash(true);
      setTimeout(() => setShowSplash(false), 1000); // Show for 1 second
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "radial-gradient(circle, #d5e9f0,rgb(0, 238, 255))", // Vibrant splash colors
            zIndex: 10,
            pointerEvents: "none",
          }}
        />
      )}
    </AnimatePresence>
  );
}
