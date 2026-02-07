import { Card } from "../ui/card";
import { Featuresprops } from "../constant/main-constant.js";

export default function Features() {
  return (
    <section className="px-6 py-20 max-w-7xl mx-auto space-y-12">
      <div className="text-center mb-16">
        <h2 className="text-gray-900 mb-4">
          Everything You Need to Code Together
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Powerful features designed to make pair programming effortless,
          whether you're learning, teaching, or building production software.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Featuresprops.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={index}
              className="bg-white border dark:bg-blue-500/50 dark:border-blue-700 border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                  feature.color === "blue"
                    ? "from-blue-500 to-blue-600"
                    : feature.color === "purple"
                      ? "from-purple-500 to-purple-600"
                      : feature.color === "indigo"
                        ? "from-indigo-500 to-indigo-600"
                        : "from-green-500 to-green-600"
                } flex items-center justify-center mb-4 shadow-sm`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-gray-900 dark:text-white mb-2 text-sm md:text-md">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {feature.description}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
