import AgentHeaders from "../components/AgentHeaders";
import TreeIcon from "../icons/Tree";
import BookIcon from "../icons/Book";
import ChatIcon from "../icons/Chat";
import LeafIcon from "../icons/Leaf";
import { Agent } from "../types";

function AgentSelection() {
  const agentItems: Array<{
    icon: React.ReactNode;
    text: string;
    type: Agent;
  }> = [
    {
      icon: <TreeIcon width={40} height={40} className="mr-3" />,
      text: "Hitta äldreomsorg",
      type: "service",
    },
    {
      icon: <BookIcon width={40} height={40} className="mr-3" />,
      text: "Att söka äldreomsorg",
      type: "apply",
    },
    {
      icon: <ChatIcon width={40} height={40} className="mr-3" />,
      text: "Hitta kontaktinformation",
      type: "contact",
    },
    {
      icon: <LeafIcon width={40} height={40} className="mr-3" />,
      text: "Allmäna frågor",
      type: "general",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-[#FFE0DE] to-[#FFFFFF] h-full w-full px-4 pt-4 relative pb-16">
      <div className="mb-6 font-bold text-2xl animate-fade-in">
        <div>Hej! 👋</div>
        <div>Hur kan jag hjälpa dig?</div>
      </div>
      <div className="grid grid-flow-row gap-4">
        {agentItems.map((item, index) => (
          <div
            key={index}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <AgentHeaders icon={item.icon} text={item.text} agent={item.type} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AgentSelection;
