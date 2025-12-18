import { Shield, Eye, Heart, Scale } from "lucide-react";

const principles = [
  {
    icon: Shield,
    title: "Integrity",
    description: "Upholding honesty and moral principles in all actions"
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Promoting openness in institutional processes"
  },
  {
    icon: Heart,
    title: "Accountability",
    description: "Taking responsibility for our actions and decisions"
  },
  {
    icon: Scale,
    title: "Justice",
    description: "Ensuring fairness and equality for all"
  }
];

export function StickyEthicsPrinciples() {
  return (
    <div className="sticky-ethics">
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-6 shadow-card">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4 text-center">
          Our Core Principles
        </h3>
        <div className="space-y-4">
          {principles.map((principle, index) => (
            <div key={index} className="flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <principle.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm mb-1">
                  {principle.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {principle.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}