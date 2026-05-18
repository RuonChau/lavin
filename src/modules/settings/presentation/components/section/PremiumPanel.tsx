import { motion } from "framer-motion";

export function PremiumPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[28px] border border-white/60 bg-[#FFFAF4]/72 p-5 shadow-[0_20px_55px_rgba(91,58,41,0.11)] backdrop-blur-[24px] md:p-7"
    >
      {children}
    </motion.div>
  );
}