"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Particles from "react-tsparticles";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

export default function Home() {
  // State for theme management
  const [darkMode, setDarkMode] = useState(true);

  // Toggle theme function
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`relative min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} overflow-hidden`}>
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        options={{
          background: {
            color: {
              value: darkMode ? "#000" : "#fff",
            },
          },
          fpsLimit: 60,
          particles: {
            number: {
              value: 50,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: darkMode ? "#ffffff" : "#000000",
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: 0.5,
            },
            size: {
              value: 3,
              random: true,
            },
            move: {
              enable: true,
              speed: 2,
              direction: "none",
              outMode: "bounce",
            },
            links: {
              enable: true,
              distance: 150,
              color: darkMode ? "#ffffff" : "#000000",
              opacity: 0.4,
              width: 1,
            },
          },
          detectRetina: true,
        }}
      />

      {/* Theme Toggle Button */}
      <div className="absolute top-5 right-5 z-20">
        <Button
          className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={toggleTheme}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
          {/* <Lightbulb /> */}
        </Button>
      </div>

      {/* Content Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <Image src="/logo2.svg" alt="AI Mock Interview Logo" width={200} height={200} />
        </motion.div>

        {/* Heading Section with Animation */}
        <motion.h1
          className="text-5xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          AI Mock Interview
        </motion.h1>
        <motion.p
          className="text-lg text-center max-w-lg mx-auto mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
        >
          Practice your interview skills with AI-powered mock interviews tailored to your needs. Get real-time feedback, improve your skills, and match with your desired job roles.
        </motion.p>

        {/* Call-to-Action Buttons */}
        <motion.div
          className="flex space-x-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
        >
          <Link href={`/dashboard`}>
            <Button className="px-6 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-all">
              Start Interview
            </Button>
          </Link>
          <Link href={`/compiler`}>
            <Button className="px-6 py-3 text-lg bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg transition-all">
              Code Labs
            </Button>
          </Link>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1.5 }}
        >
          <p>
            Improve your skills with AI-generated interviews, helping you to be prepared for the real world.
          </p>
        </motion.div>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1.5 }}
          >
            &copy; {new Date().getFullYear()} AI Mock Interview. All rights reserved.
          </motion.p>
        </footer>
      </div>
    </div>
  );
}
