import { Shuffle, UserPlus, Bot, Shield, Search, Code2 } from "lucide-react";
import { Github, Twitter, Linkedin, Youtube } from "lucide-react";
export const Steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Sign Up",
    description:
      "Create your free account in seconds. No credit card required. Choose your preferred programming languages and skill level.",
  },
  {
    number: "02",
    icon: Search,
    title: "Find a Partner",
    description:
      "Match with a random developer, invite a friend, or request an AI assistant. Get paired based on your language and availability.",
  },
  {
    number: "03",
    icon: Code2,
    title: "Code Together with AI",
    description:
      "Start coding in real-time with your partner. Get AI-powered suggestions, share screens, and build amazing projects together.",
  },
];

export const Featuresprops = [
  {
    icon: Shuffle,
    title: "Pair with Random Developers",
    description:
      "Match with developers worldwide based on your programming language and skill level. Expand your network and learn new approaches.",
    color: "blue",
  },
  {
    icon: UserPlus,
    title: "Invite Friends",
    description:
      "Collaborate seamlessly with your team. Share private session links and work together in real-time on any project.",
    color: "purple",
  },
  {
    icon: Bot,
    title: "Code with AI",
    description:
      "Get intelligent suggestions and pair with an AI assistant that understands your code. Debug faster and learn best practices.",
    color: "indigo",
  },
  {
    icon: Shield,
    title: "Secure Real-Time",
    description:
      "End-to-end encrypted sessions with enterprise-grade security. Your code stays private and protected at all times.",
    color: "green",
  },
];

export const NavItems = ["Features", "How it works", "Testimonials", "Demo"];

export const FooterLinks = {
  product: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "FAQ", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
  resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Community", href: "#" },
  ],
};

export const SocialLinks = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export const Testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Developer",
    company: "TechCorp",
    avatar:
      "https://images.unsplash.com/photo-1573495628363-7114730a4a11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNvZnR3YXJlJTIwZW5naW5lZXJ8ZW58MXx8fHwxNzYwOTQwMTA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    quote:
      "PairCode has transformed how our team collaborates. The real-time coding is seamless, and the AI assistant helps us catch issues early. Highly recommend!",
    rating: 5,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Marcus Rodriguez",
    role: "Full Stack Engineer",
    company: "StartupHub",
    avatar:
      "https://images.unsplash.com/photo-1634133472760-e5c2bd346787?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcHJvZ3JhbW1lciUyMGhlYWRzaG90fGVufDF8fHx8MTc2MDk4NDYzOXww&ixlib=rb-4.1.0&q=80&w=1080",
    quote:
      "I've learned more in a month of pair programming sessions than I did in a year coding solo. The community is incredible, and matching with random devs is always exciting.",
    rating: 5,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Aisha Patel",
    role: "Software Architect",
    company: "CloudScale",
    avatar:
      "https://images.unsplash.com/photo-1737575655055-e3967cbefd03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkZXZlbG9wZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjA5ODAwOTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    quote:
      "The security features are enterprise-grade. We use it for onboarding new developers and code reviews. It's become an essential part of our workflow.",
    rating: 5,
    gradient: "from-indigo-500 to-purple-500",
  },
];
