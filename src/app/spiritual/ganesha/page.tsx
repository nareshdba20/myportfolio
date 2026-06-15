import type { Metadata } from "next";
import GaneshaContent from "./GaneshaContent";

export const metadata: Metadata = {
  title: "ಗಣೇಶ — ಪವಿತ್ರ ಶ್ಲೋಕಗಳು | Naresh Gowda",
  description: "ಶ್ರೀ ಗಣೇಶನಿಗೆ ಅರ್ಪಿತ ಶ್ಲೋಕಗಳು. ಅಗಜಾನನ ಪದ್ಮಾರ್ಕಂ — ಕನ್ನಡ, ಹಿಂದಿ, ತೆಲುಗು, ತಮಿಳು ಮತ್ತು ಮಲಯಾಳಂ ಭಾಷೆಗಳಲ್ಲಿ.",
};

export default function GaneshaPage() {
  return <GaneshaContent />;
}
