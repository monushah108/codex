"use client";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Testimonials } from "../constant/main-constant";

export default function Testimonial() {
  return (
    <section className="px-10 py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center flex-col gap-8 ">
        <h2 className="font-medium">Trusted by Developers Worldwid</h2>
        <p className="text-sm">
          see waht developers are saying about their PairCode experience{" "}
        </p>
        <div className="grid gap-8 md:grid-cols-3 mt-12">
          {Testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.2,
                ease: "easeOut",
              }}
              whileHover={{
                y: -8,
                transition: { duration: 0.2 },
              }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-10"
            >
              <div className="flex items-center gap-1 ">
                {Array(testimonial.rating)
                  .fill(0)
                  .map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: index * 0.2 + i * 0.1,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      <Star className="fill-amber-400 text-amber-400 w-5 h-5" />
                    </motion.div>
                  ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic text-sm">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 ">
                <Avatar className="w-12 h-12 object-cover rounded-full">
                  <AvatarImage
                    className="object-cover"
                    src={testimonial.avatar}
                    alt={testimonial.name}
                  />
                  <AvatarFallback>
                    <div className="ml-4"> {testimonial.name.charAt(0)}</div>
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-gray-900 dark:text-white ">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    @{testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
