import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import mtnLogo from "@/assets/mtn-logo.png";

interface PasswordModalProps {
  onAuthenticate: () => void;
}

const CORRECT_PASSWORD = "fiberxadmin2025";

export const PasswordModal = ({ onAuthenticate }: PasswordModalProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsVisible(false);
      setTimeout(onAuthenticate, 300);
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="w-full max-w-md mx-4"
          >
            <div className="bg-card border-border rounded-2xl shadow-2xl p-8 space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <img src={mtnLogo} alt="MTN Logo" className="h-16 w-auto" />
                <div className="text-center">
                  <h2 className="text-2xl font-bold">Manager Access</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Enter password to continue
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className="h-12 text-center text-lg"
                    autoFocus
                  />
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-destructive text-sm text-center"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                <Button type="submit" className="w-full h-12 text-lg">
                  Login
                </Button>

                <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                  <Lock className="h-4 w-4" />
                  <span>Secure Access</span>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
