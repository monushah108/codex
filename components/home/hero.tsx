import { motion } from "motion/react";
import { MoveRight, Play } from "lucide-react";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2  gap-12 items-center">
        <div className="space-y-6 text-sm">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 ">
            <motion.span
              className="w-2 h-2 rounded-full bg-blue-500  "
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Now with AI-powered pairing
            </span>
          </div>
          <h1 className="text-gray-900 dark:text-white">
            <span> Code Together,</span>
            <br />
            <span>Build Better Software</span>
          </h1>
          <p className="text-gray-500">
            Connect with developers worldwide, collaborate with your team, or
            pair with AI. Experience real-time coding that accelerates learning
            and productivity.
          </p>
          <div className="flex items-center flex-wrap gap-4">
            {/* <Link to="/Auth"> */}
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all px-6">
              <span>Start coding free</span>
              <span>
                <MoveRight />
              </span>
            </Button>
            {/* </Link> */}
            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 px-6"
            >
              <span>Watch demo video</span>
              <Play />
            </Button>
          </div>
          <div className="flex items-center  gap-8 pt-4">
            <div>
              <div className="text-gray-900 dark:text-white">50K+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Active Developers
              </div>
            </div>
            <div>
              <div className="text-gray-900 dark:text-white">1M+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Sessions Completed
              </div>
            </div>
          </div>
        </div>
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 50 }}
        >
          <motion.div
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Editor Header */}
            <div className="flex items-center gap-2 px-5 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <motion.div
                  className="w-3 h-3 rounded-full bg-red-400"
                  whileHover={{ scale: 1.3 }}
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-3 h-3 rounded-full bg-yellow-400"
                  whileHover={{ scale: 1.3 }}
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                />
                <motion.div
                  className="w-3 h-3 rounded-full bg-green-400"
                  whileHover={{ scale: 1.3 }}
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                />
              </div>
              <div className="ml-4 flex-1 flex items-center gap-2">
                <motion.div
                  className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                >
                  main.tsx
                </motion.div>
              </div>
            </div>

            {/* Editor Content */}
            <div className="p-6 font-mono text-sm space-y-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-[400px]">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((lineNum, index) => (
                <motion.div
                  key={lineNum}
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                >
                  <span className="text-gray-400 select-none w-8 text-right">
                    {lineNum}
                  </span>
                  {lineNum === 1 && (
                    <div>
                      <span className="text-purple-600">import</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {" "}
                        {"{"} useState {"}"}{" "}
                      </span>
                      <span className="text-purple-600">from</span>
                      <span className="text-green-600"> 'react'</span>
                    </div>
                  )}
                  {lineNum === 3 && (
                    <div>
                      <span className="text-purple-600">function</span>
                      <span className="text-blue-600"> App</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        () {"{"}
                      </span>
                    </div>
                  )}
                  {lineNum === 4 && (
                    <div className="pl-6">
                      <span className="text-purple-600">const</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {" "}
                        [count, setCount] ={" "}
                      </span>
                      <span className="text-blue-600">useState</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        (0)
                      </span>
                    </div>
                  )}
                  {lineNum === 6 && (
                    <div className="pl-6">
                      <span className="text-purple-600">return</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {" "}
                        (
                      </span>
                    </div>
                  )}
                  {lineNum === 7 && (
                    <div className="pl-12">
                      <span className="text-gray-700 dark:text-gray-300">
                        {"<"}
                      </span>
                      <span className="text-blue-600">button</span>
                      <span className="text-purple-600"> onClick</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        ={"{"}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        () {"=> "}
                      </span>
                      <span className="text-blue-600">setCount</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        (count + 1){"}"}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {">"}
                      </span>
                    </div>
                  )}
                  {lineNum === 8 && (
                    <div className="pl-16">
                      <span className="text-gray-700 dark:text-gray-300">
                        Count: {"{"}count{"}"}
                      </span>
                    </div>
                  )}
                  {lineNum === 9 && (
                    <div className="pl-12">
                      <span className="text-gray-700 dark:text-gray-300">
                        {"</"}
                      </span>
                      <span className="text-blue-600">button</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {">"}
                      </span>
                    </div>
                  )}
                  {lineNum === 10 && (
                    <div className="pl-6">
                      <span className="text-gray-700 dark:text-gray-300">
                        )
                      </span>
                    </div>
                  )}
                  {lineNum === 11 && (
                    <div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {"}"}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Collaboration indicators */}
              <motion.div
                className="absolute top-32 right-8 flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-3 py-2"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="flex -space-x-2">
                  <motion.div
                    className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                  >
                    A
                  </motion.div>
                  <motion.div
                    className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                  >
                    B
                  </motion.div>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  2 coding
                </span>
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-500"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
