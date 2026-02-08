"use client";
import { motion } from "framer-motion";

export default function Demo() {
  return (
    <section className="relative px-6 py-20 max-w-7xl mx-auto overflow-hidden">
      <div className="flex items-center justify-center flex-col gap-8 text-center">
        <div className="space-y-3 ">
          <h2 className="text-gray-900 dark:text-white mb-4">
            See PairCode in Action
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Watch how easy it is to start a coding session and collaborate in
            real-time
          </p>
        </div>
        <div className="relative max-w-5xl mx-auto">
          {/* <video
            className="relative aspect-video rounded-2xl shadow-2xl overflow-hidden border border-gray-300 dark:border-gray-700"
            src={video}
            autoPlay
            loop
            controls
          ></video> */}
        </div>
        <motion.div
          className="grid md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-sm text-gray-900 dark:text-white">
              Instant Setup
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Start coding in seconds
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🔄</div>
            <div className="text-sm text-gray-900 dark:text-white">
              Real-Time Sync
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              See changes instantly
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🤖</div>
            <div className="text-sm text-gray-900 dark:text-white">
              AI Assistance
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Get smart suggestions
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
