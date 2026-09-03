"use client";
import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "motion/react";
import { cn } from "@/lib/utils";

export const CometCard = ({
  rotateDepth = 17.5,
  translateDepth = 20,
  className,
  children,
  backContent,
}: {
  rotateDepth?: number;
  translateDepth?: number;
  className?: string;
  children: React.ReactNode;
  backContent?: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`-${rotateDepth}deg`, `${rotateDepth}deg`],
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`${rotateDepth}deg`, `-${rotateDepth}deg`],
  );

  const translateX = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`-${translateDepth}px`, `${translateDepth}px`],
  );
  const translateY = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`${translateDepth}px`, `-${translateDepth}px`],
  );

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.9) 10%, rgba(255, 255, 255, 0.75) 20%, rgba(255, 255, 255, 0) 80%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || isFlipped) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    if (!isFlipped) {
      x.set(0);
      y.set(0);
    }
  };

  const handleClick = () => {
    if (backContent) {
      const nextFlipped = !isFlipped;
      setIsFlipped(nextFlipped);
      if (nextFlipped) {
        x.set(0);
        y.set(0);
      }
    }
  };

  return (
    <div 
      className={cn("[perspective:1000px] [transform-style:preserve-3d]", backContent ? "cursor-pointer" : "", className)}
      onClick={handleClick}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          translateX,
          translateY,
          boxShadow:
            "rgba(0, 0, 0, 0.01) 0px 520px 146px 0px, rgba(0, 0, 0, 0.04) 0px 333px 133px 0px, rgba(0, 0, 0, 0.26) 0px 83px 83px 0px, rgba(0, 0, 0, 0.29) 0px 21px 46px 0px",
        }}
        initial={{ scale: 1, z: 0 }}
        animate={{
          scale: isFlipped ? 1 : undefined,
          z: isFlipped ? 0 : undefined,
        }}
        whileHover={
          isFlipped
            ? {}
            : {
                scale: 1.05,
                z: 50,
                transition: { duration: 0.2 },
              }
        }
        className="relative rounded-2xl [transform-style:preserve-3d]"
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 200, damping: 20 }}
          className="relative h-full w-full [transform-style:preserve-3d]"
        >
          {/* FRONT */}
          <div 
            className="w-full h-full [backface-visibility:hidden]"
            style={{ pointerEvents: isFlipped ? 'none' : 'auto' }}
          >
            {children}
            {/* Glare effect restricted to front face to avoid 3D clipping during flip */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-50 h-full w-full rounded-[16px] mix-blend-overlay"
              style={{
                background: glareBackground,
                opacity: 0.2,
              }}
              transition={{ duration: 0.2 }}
            />
          </div>

          {/* BACK */}
          {backContent && (
            <div 
              className="absolute inset-0 h-full w-full [backface-visibility:hidden] [transform:rotateY(180deg)]"
              style={{ pointerEvents: isFlipped ? 'auto' : 'none' }}
            >
              {backContent}
            </div>
          )}
        </motion.div>

      </motion.div>
    </div>
  );
};
